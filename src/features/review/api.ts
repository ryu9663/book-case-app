import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Review } from '@/types/models';
import type { CreateReviewDto, UpdateReviewDto } from '@/types/api';

// ----- Query keys -----
export const reviewKeys = {
  byBook: (bookId: number) => ['reviews', 'book', bookId] as const,
  detail: (bookId: number, reviewId: number) =>
    ['reviews', 'book', bookId, reviewId] as const,
};

// ----- Raw API -----
async function fetchReviews(bookId: number): Promise<Review[]> {
  const { data } = await apiClient.get<Review[]>(endpoints.bookReviews(bookId));
  return data;
}

async function fetchReview(
  bookId: number,
  reviewId: number,
): Promise<Review> {
  const { data } = await apiClient.get<Review>(
    endpoints.bookReview(bookId, reviewId),
  );
  return data;
}

async function createReview(
  bookId: number,
  dto: CreateReviewDto,
): Promise<Review> {
  const { data } = await apiClient.post<Review>(
    endpoints.bookReviews(bookId),
    dto,
  );
  return data;
}

async function updateReview(
  bookId: number,
  reviewId: number,
  dto: UpdateReviewDto,
): Promise<Review> {
  const { data } = await apiClient.patch<Review>(
    endpoints.bookReview(bookId, reviewId),
    dto,
  );
  return data;
}

async function deleteReview(
  bookId: number,
  reviewId: number,
): Promise<void> {
  await apiClient.delete(endpoints.bookReview(bookId, reviewId));
}

// ----- Hooks -----
export function useReviews(bookId: number) {
  return useQuery({
    queryKey: reviewKeys.byBook(bookId),
    queryFn: () => fetchReviews(bookId),
    enabled: !!bookId,
  });
}

export function useReview(bookId: number, reviewId: number) {
  return useQuery({
    queryKey: reviewKeys.detail(bookId, reviewId),
    queryFn: () => fetchReview(bookId, reviewId),
    enabled: !!bookId && !!reviewId,
  });
}

export function useCreateReview(bookId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => createReview(bookId, dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: reviewKeys.byBook(bookId) }),
  });
}

export function useUpdateReview(bookId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      dto,
    }: {
      reviewId: number;
      dto: UpdateReviewDto;
    }) => updateReview(bookId, reviewId, dto),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: reviewKeys.byBook(bookId) }),
  });
}

export function useDeleteReview(bookId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(bookId, reviewId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: reviewKeys.byBook(bookId) }),
  });
}
