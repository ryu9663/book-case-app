import { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Appbar, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpenAnimation } from '../components/BookOpenAnimation';
import { BookCover } from '../components/BookCover';
import { BookInfoCard } from '../components/BookInfoCard';
import { BookEditDialog } from '../components/BookEditDialog';
import {
  useBookControllerFindOne,
  useBookControllerUpdate,
  useBookControllerRemove,
  getBookControllerFindAllQueryKey,
  getBookControllerFindOneQueryKey,
} from '@/api/generated/books/books';
import { useQueryClient } from '@tanstack/react-query';
import { ReviewList } from '@/features/review/components/ReviewList';
import { useAuth } from '@/features/auth/auth-context';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorScreen } from '@/components/ui/ErrorScreen';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { colors } from '@/lib/theme/colors';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookId = Number(id);
  const {
    data: book,
    isLoading,
    error,
    refetch,
  } = useBookControllerFindOne(bookId);

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
      <ImageBackground
        // source={require('@assets/login/background.webp')}
        source={book.thumbnail || require('@assets/login/background.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.whiteOverlay} />
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction
            color={colors.shelfBrown}
            onPress={() => router.back()}
          />
          <Appbar.Content title={book.title} titleStyle={styles.headerTitle} />
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
          {/* <View style={styles.coverSection}>
            <BookOpenAnimation>
              <BookCover
                title={book.title}
                author={book.author}
                thumbnail={book.thumbnail}
              />
            </BookOpenAnimation>
          </View> */}

          {/* <BookInfoCard book={book} /> */}

          <View style={styles.reviewSection}>
            <ReviewList
              bookId={bookId}
              onAddReview={() =>
                router.push(`/(main)/(bookshelf)/review/create?bookId=${bookId}`)
              }
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 253, 245, 0.7)',
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: colors.shelfBrown,
    fontWeight: '700',
    fontSize: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  coverSection: {
    alignItems: 'center',
    paddingVertical: 32,
    // Add a spotlight effect or shadow for the book sitting on desk
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  reviewSection: {
    marginTop: 24,
  },
});
