import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpenAnimation } from '../components/BookOpenAnimation';
import { BookCover } from '../components/BookCover';
import { BookInfoCard } from '../components/BookInfoCard';
import { BookEditDialog } from '../components/BookEditDialog';
import { useBook, useUpdateBook, useDeleteBook } from '../api';
import { ReviewList } from '@/features/review/components/ReviewList';
import { useAuth } from '@/features/auth/auth-context';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/lib/theme/colors';

export function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookId = Number(id);
  const { user } = useAuth();
  const { data: book, isLoading, error, refetch } = useBook(bookId);
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleSave = async (title: string, author: string) => {
    try {
      await updateBook.mutateAsync({ id: bookId, dto: { title, author } });
      setEditVisible(false);
      setSnackbar('수정되었습니다.');
    } catch {
      setSnackbar('수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook.mutateAsync(bookId);
      router.back();
    } catch {
      setSnackbar('삭제에 실패했습니다.');
      setDeleteVisible(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error || !book)
    return <ErrorScreen message="책 정보를 불러올 수 없습니다." onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="#FFF" onPress={() => router.back()} />
        <Appbar.Content title={book.title} titleStyle={styles.headerTitle} />
        <Appbar.Action icon="pencil" color="#FFF" onPress={() => setEditVisible(true)} />
        <Appbar.Action icon="delete" color="#FFF" onPress={() => setDeleteVisible(true)} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverSection}>
          <BookOpenAnimation>
            <BookCover title={book.title} author={book.author} />
          </BookOpenAnimation>
        </View>

        <BookInfoCard book={book} />

        <View style={styles.reviewSection}>
          <ReviewList
            bookId={bookId}
            onAddReview={() => router.push(`/(main)/review/create?bookId=${bookId}`)}
          />
        </View>
      </ScrollView>

      <BookEditDialog
        visible={editVisible}
        book={book}
        onSave={handleSave}
        onDismiss={() => setEditVisible(false)}
        isLoading={updateBook.isPending}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title="책 삭제"
        message={`"${book.title}"을(를) 삭제하시겠습니까?\n관련 독후감도 함께 삭제됩니다.`}
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onDismiss={() => setDeleteVisible(false)}
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
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.shelfBrown,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  coverSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  reviewSection: {
    marginTop: 24,
  },
});
