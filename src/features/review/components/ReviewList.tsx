import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { ReviewCard } from './ReviewCard';
import { ReviewDeleteDialog } from './ReviewDeleteDialog';
import { useReviews, useDeleteReview } from '../api';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/lib/theme/colors';
import type { Review } from '@/types/models';

interface Props {
  bookId: number;
  onAddReview: () => void;
}

export function ReviewList({ bookId, onAddReview }: Props) {
  const { data: reviews, isLoading } = useReviews(bookId);
  const deleteReview = useDeleteReview(bookId);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview.mutateAsync(selectedReview.id);
      setSnackbar('독후감이 삭제되었습니다.');
    } catch {
      setSnackbar('삭제에 실패했습니다.');
    } finally {
      setDeleteVisible(false);
      setSelectedReview(null);
    }
  };

  if (isLoading) return <LoadingScreen message="독후감 로딩 중..." />;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>독후감</Text>
        <Button
          mode="contained-tonal"
          icon="plus"
          onPress={onAddReview}
          compact
        >
          작성
        </Button>
      </View>

      {!reviews || reviews.length === 0 ? (
        <EmptyState
          icon="📝"
          title="아직 독후감이 없어요"
          description="첫 번째 독후감을 작성해보세요!"
        />
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={() =>
              router.push(
                `/(main)/review/${review.id}?bookId=${bookId}`,
              )
            }
            onDelete={() => {
              setSelectedReview(review);
              setDeleteVisible(true);
            }}
          />
        ))
      )}

      <ReviewDeleteDialog
        visible={deleteVisible}
        reviewTitle={selectedReview?.title ?? ''}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
