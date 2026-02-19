import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { ReviewCard } from './ReviewCard';
import { ReviewDeleteDialog } from './ReviewDeleteDialog';
import {
  useReviewControllerFindAll,
  useReviewControllerRemove,
  getReviewControllerFindAllQueryKey,
} from '@/api/generated/reviews/reviews';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors } from '@/lib/theme/colors';
import type { ReviewResponseDto } from '@/api/generated/models';

interface Props {
  bookId: number;
}

export function ReviewList({ bookId }: Props) {
  const queryClient = useQueryClient();
  const { data: reviews, isLoading } = useReviewControllerFindAll(bookId);
  const deleteReview = useReviewControllerRemove();

  const [selectedReview, setSelectedReview] =
    useState<ReviewResponseDto | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview.mutateAsync({ bookId, id: selectedReview.id });
      await queryClient.invalidateQueries({
        queryKey: getReviewControllerFindAllQueryKey(bookId),
      });
      setSnackbar('독후감이 삭제되었습니다.');
    } catch {
      setSnackbar('삭제에 실패했습니다.');
    } finally {
      setDeleteVisible(false);
      setSelectedReview(null);
    }
  };

  if (isLoading) return <LoadingScreen message="독후감 로딩 중..." />;

  const entryCount = reviews?.length ?? 0;

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>독후감</Text>
        {entryCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{entryCount}개</Text>
          </View>
        )}
      </View>

      {!reviews || reviews.length === 0 ? (
        <EmptyState
          title="아직 독후감이 없어요"
          description="우측 하단 + 버튼으로 작성해보세요!"
        />
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={() =>
              router.push(
                `/(main)/(bookshelf)/review/${review.id}?bookId=${bookId}`,
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
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: 'rgba(85, 139, 47, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentGreen,
  },
});
