import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, FAB, Snackbar, Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

import { EditBookModal } from '../components/EditBookModal';
import { BookCover } from '../components/BookCover';
import {
  useBookControllerFindOne,
  useBookControllerUpdate,
  useBookControllerRemove,
  getBookControllerFindAllQueryKey,
  getBookControllerFindOneQueryKey,
} from '@/api/generated/books/books';
import { useReviewControllerFindAll } from '@/api/generated/reviews/reviews';
import { useQueryClient } from '@tanstack/react-query';
import { ReviewList } from '@/features/review/components/ReviewList';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/lib/theme/colors';
import { styles } from './BookDetailScreen.styles';

export function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookId = Number(id);
  const {
    data: book,
    isLoading,
    error,
    refetch,
  } = useBookControllerFindOne(bookId);

  const { data: reviews } = useReviewControllerFindAll(bookId);
  const lastReadPage =
    reviews && reviews.length > 0
      ? [...reviews].sort((a, b) => b.endDate.localeCompare(a.endDate))[0]
          .endPage
      : null;

  const queryClient = useQueryClient();
  const updateBook = useBookControllerUpdate();
  const deleteBook = useBookControllerRemove();

  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleSave = async (title: string, author: string) => {
    try {
      await updateBook.mutateAsync({ id: bookId, data: { title, author } });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getBookControllerFindOneQueryKey(bookId),
        }),
        queryClient.invalidateQueries({
          queryKey: getBookControllerFindAllQueryKey(),
        }),
      ]);
      setEditVisible(false);
      setSnackbar('수정되었습니다.');
    } catch {
      setSnackbar('수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook.mutateAsync({ id: bookId });
      await queryClient.invalidateQueries({
        queryKey: getBookControllerFindAllQueryKey(),
      });
      router.back();
    } catch {
      setSnackbar('삭제에 실패했습니다.');
      setDeleteVisible(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error || !book)
    return (
      <ErrorScreen message="책 정보를 불러올 수 없습니다." onRetry={refetch} />
    );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          color={colors.shelfBrown}
          onPress={() => router.back()}
        />
        <Appbar.Content title="책 상세" titleStyle={styles.headerTitle} />
        <Appbar.Action
          icon="pencil"
          color={colors.shelfBrown}
          onPress={() => setEditVisible(true)}
        />
        <Appbar.Action
          icon="delete"
          color={colors.shelfBrown}
          onPress={() => setDeleteVisible(true)}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverBackground}>
          <BookCover
            title={book.title}
            author={book.author}
            thumbnail={book.thumbnail}
          />
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.bookTitle} textBreakStrategy="simple">
            {book.title}
          </Text>
          <Text style={styles.bookAuthor} textBreakStrategy="simple">
            {book.author}
          </Text>
          {lastReadPage !== null && (
            <Text style={styles.readingStatusText}>
              마지막으로 읽은 페이지: p.{lastReadPage}
            </Text>
          )}
        </View>
        <View style={styles.reviewSection}>
          <ReviewList bookId={bookId} />
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() =>
          router.push(`/(main)/(bookshelf)/review/create?bookId=${bookId}`)
        }
        accessibilityLabel="독후감 작성"
      />
      <EditBookModal
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
