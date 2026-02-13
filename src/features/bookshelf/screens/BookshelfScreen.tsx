import { useMemo, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Platform } from 'react-native';
import { Appbar, Menu, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { BookshelfRow } from '../components/BookshelfRow';
import { EmptyShelf } from '../components/EmptyShelf';
import { AddBookFAB } from '../components/AddBookFAB';
import { useBookControllerFindAll, useBookControllerRemove, getBookControllerFindAllQueryKey } from '@/api/generated/books/books';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/auth-context';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/lib/theme/colors';
import type { Book } from '@/api/generated/models';

const BOOKS_PER_ROW = 4;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function BookshelfScreen() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: books, isLoading, error, refetch } = useBookControllerFindAll();
  const deleteBookMutation = useBookControllerRemove();

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const rows = useMemo(
    () => chunkArray(books ?? [], BOOKS_PER_ROW),
    [books],
  );

  const handleBookPress = useCallback((book: Book) => {
    router.push(`/(main)/book/${book.id}`);
  }, []);

  const handleBookLongPress = useCallback((book: Book) => {
    setSelectedBook(book);
    setDeleteDialogVisible(true);
  }, []);

  const handleDelete = async () => {
    if (!selectedBook) return;
    try {
      await deleteBookMutation.mutateAsync({ id: selectedBook.id });
      await queryClient.invalidateQueries({ queryKey: getBookControllerFindAllQueryKey() });
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
  if (error) return <ErrorScreen message="책 목록을 불러올 수 없습니다." onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="내 책장" titleStyle={styles.headerTitle} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color="#FFF"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="로그아웃"
            onPress={() => {
              setMenuVisible(false);
              logout();
            }}
          />
        </Menu>
      </Appbar.Header>

      {books && books.length === 0 ? (
        <EmptyShelf onAddBook={goAddBook} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={refetch} />
          }
        >
          {rows.map((row, idx) => (
            <BookshelfRow
              key={idx}
              books={row}
              onBookPress={handleBookPress}
              onBookLongPress={handleBookLongPress}
            />
          ))}
        </ScrollView>
      )}

      <AddBookFAB onPress={goAddBook} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream, // Warm beige
  },
  header: {
    backgroundColor: colors.shelfBrown,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerTitle: {
    color: '#FFF8E1', // Old Lace
    // Use serif for a classic book feel
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
    fontSize: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 100,
  },
});
