import { useMemo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddBookModal } from '@/features/book/components/AddBookModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useBookControllerFindAll,
  useBookControllerRemove,
  getBookControllerFindAllQueryKey,
} from '@/api/generated/books/books';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BookCover } from '../components/BookCover';
import { BookResponseDto } from '@/api/generated/models';
import { styles } from './BookshelfScreen.styles';

const BOOK_WIDTH = 100;
const BOOK_ASPECT = 2 / 3.2;
const BOOK_HEIGHT = BOOK_WIDTH / BOOK_ASPECT;
const ROW_GAP = 10;
const ROW_PADDING_H = 22;
const MIN_ROWS = 3;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

type GridItem = BookResponseDto | 'add';

export function BookshelfScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const queryClient = useQueryClient();
  const { data: books, isLoading, error, refetch } = useBookControllerFindAll();

  const deleteBookMutation = useBookControllerRemove();

  const [selectedBook, setSelectedBook] = useState<BookResponseDto | null>(
    null,
  );
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [addBookVisible, setAddBookVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const booksPerRow = useMemo(() => {
    const availableWidth = screenWidth - ROW_PADDING_H * 2;
    return Math.max(1, Math.floor((availableWidth + ROW_GAP) / (BOOK_WIDTH + ROW_GAP)));
  }, [screenWidth]);

  const rows = useMemo(() => {
    const bookList = books ?? [];
    const items: GridItem[] = [...bookList, 'add'];
    const minTotalSlots = booksPerRow * MIN_ROWS;
    const totalSlots = Math.max(items.length, minTotalSlots);
    const padded: (GridItem | null)[] = [...items];
    while (padded.length < totalSlots) {
      padded.push(null);
    }
    return chunkArray(padded, booksPerRow);
  }, [books, booksPerRow]);

  const handleBookPress = useCallback((book: BookResponseDto) => {
    router.push(`/(main)/(bookshelf)/book/${book.id}`);
  }, []);

  const handleBookLongPress = useCallback((book: BookResponseDto) => {
    setSelectedBook(book);
    setDeleteDialogVisible(true);
  }, []);

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await deleteBookMutation.mutateAsync({ id: selectedBook.id });
      await queryClient.invalidateQueries({
        queryKey: getBookControllerFindAllQueryKey(),
      });
      setSnackbar('책이 삭제되었습니다.');
    } catch {
      setSnackbar('삭제에 실패했습니다.');
    } finally {
      setDeleteDialogVisible(false);
      setSelectedBook(null);
    }
  };

  const goAddBook = () => setAddBookVisible(true);

  const handleAddBookSuccess = (message: string) => {
    setSnackbar(message);
  };

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <ErrorScreen message="책 목록을 불러올 수 없습니다." onRetry={refetch} />
    );

  const bookCount = books?.length ?? 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>
          나의 서재<Text style={styles.subTitle}>({bookCount}권의 기록)</Text>
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        <View>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.rowWrapper}>
              {/* Book Row */}
              <View style={[styles.row, { minHeight: BOOK_HEIGHT }]}>
                {row.map((item, colIdx) => {
                  if (item === null) {
                    return (
                      <View
                        key={`empty-${rowIdx}-${colIdx}`}
                        style={{ width: BOOK_WIDTH }}
                      />
                    );
                  }
                  if (item === 'add') {
                    return (
                      <View key="add" style={{ width: BOOK_WIDTH }}>
                        <Pressable
                          testID="add-book-button"
                          onPress={goAddBook}
                          style={({ pressed }) => [
                            styles.addButton,
                            pressed && { opacity: 0.5 },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="plus"
                            size={24}
                            color="rgba(117, 137, 97,0.4)"
                          />
                        </Pressable>
                      </View>
                    );
                  }
                  return (
                    <View key={item.id} style={{ width: BOOK_WIDTH }}>
                      <BookCover
                        book={item}
                        onPress={() => handleBookPress(item)}
                        onLongPress={() => handleBookLongPress(item)}
                      />
                    </View>
                  );
                })}
                {/* Fill remaining slots if row is short */}
                {row.length < booksPerRow &&
                  Array.from({ length: booksPerRow - row.length }).map(
                    (_, i) => <View key={`pad-${i}`} style={{ width: BOOK_WIDTH }} />,
                  )}
              </View>

              {/* Shelf Plank */}
              <View style={styles.shelfPlank}>
                <View style={styles.shelfTop} />
                <View style={styles.shelfSide} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <AddBookModal
        visible={addBookVisible}
        onDismiss={() => setAddBookVisible(false)}
        onSuccess={handleAddBookSuccess}
      />

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="책 삭제"
        message={`"${selectedBook?.title ?? ''}"을(를) 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
      />

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}
