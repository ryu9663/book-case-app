import { useMemo, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  Pressable,
  ImageBackground,
} from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  useBookControllerFindAll,
  useBookControllerRemove,
  getBookControllerFindAllQueryKey,
} from '@/api/generated/books/books';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/auth-context';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BookCover } from '../components/BookCover';
import { colors } from '@/lib/theme/colors';
import { BookResponseDto } from '@/api/generated/models';

const BOOKS_PER_ROW = 3;
const MIN_TOTAL_SLOTS = 9;

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
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: books, isLoading, error, refetch } = useBookControllerFindAll();

  const deleteBookMutation = useBookControllerRemove();

  const [selectedBook, setSelectedBook] = useState<BookResponseDto | null>(
    null,
  );
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const rows = useMemo(() => {
    const bookList = books ?? [];
    const items: GridItem[] = [...bookList, 'add'];
    // Pad to minimum slots for a full bookshelf look
    const totalSlots = Math.max(items.length, MIN_TOTAL_SLOTS);
    const padded: (GridItem | null)[] = [...items];
    while (padded.length < totalSlots) {
      padded.push(null);
    }
    return chunkArray(padded, BOOKS_PER_ROW);
  }, [books]);

  const handleBookPress = useCallback((book: BookResponseDto) => {
    router.push(`/(main)/book/${book.id}`);
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

  const goAddBook = () => router.push('/(main)/add-book');

  if (isLoading) return <LoadingScreen />;
  if (error)
    return (
      <ErrorScreen message="책 목록을 불러올 수 없습니다." onRetry={refetch} />
    );

  const bookCount = books?.length ?? 0;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@assets/book-shelf/background.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.whiteOverlay} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>나의 서재</Text>
          <Pressable
            onPress={logout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={colors.contentBg}
            />
          </Pressable>
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
                <View style={styles.row}>
                  {row.map((item, colIdx) => {
                    if (item === null) {
                      return (
                        <View
                          key={`empty-${rowIdx}-${colIdx}`}
                          style={styles.gridItem}
                        />
                      );
                    }
                    if (item === 'add') {
                      return (
                        <View key="add" style={styles.gridItem}>
                          <Pressable
                            onPress={goAddBook}
                            style={({ pressed }) => [
                              styles.addButton,
                              pressed && {
                                backgroundColor: 'rgba(255,255,255,0.05)',
                              },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="plus"
                              size={24}
                              color="rgba(255,255,255,0.3)"
                            />
                          </Pressable>
                        </View>
                      );
                    }
                    return (
                      <View key={item.id} style={styles.gridItem}>
                        <BookCover
                          book={item}
                          onPress={() => handleBookPress(item)}
                          onLongPress={() => handleBookLongPress(item)}
                        />
                      </View>
                    );
                  })}
                  {/* Fill remaining slots if row is short */}
                  {row.length < BOOKS_PER_ROW &&
                    Array.from({ length: BOOKS_PER_ROW - row.length }).map(
                      (_, i) => (
                        <View key={`pad-${i}`} style={styles.gridItem} />
                      ),
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

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.footerText}>{bookCount}권의 수집된 이야기</Text>
          <Text style={styles.footerText}>Established 2026</Text>
        </View>

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
      </ImageBackground>
    </View>
  );
}

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.shelfBg,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 253, 245, 0.40)',
  },
  // Header
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.headerBg}E6`, // 90% opacity
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: serifFont,
    color: colors.contentBg,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },

  // Scroll Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },

  rowWrapper: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
  },
  gridItem: {
    flex: 1,
  },

  // Add Button
  addButton: {
    width: '100%',
    aspectRatio: 2 / 3.2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Shelf Plank
  shelfPlank: {
    marginTop: 6,
    marginHorizontal: -8,
  },
  shelfTop: {
    height: 8,
    backgroundColor: colors.shelfPlank,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  shelfSide: {
    height: 6,
    backgroundColor: colors.shelfPlankSide,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: serifFont,
    fontStyle: 'italic',
  },
});
