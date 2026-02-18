import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useBookControllerFindAll } from '@/api/generated/books/books';
import { getReviewControllerFindAllQueryOptions } from '@/api/generated/reviews/reviews';
import { ReviewResponseDto } from '@/api/generated/model';
import { buildDateToBookMap } from '../utils';
import { DateToBookMap } from '../types';

export function useCalendarData() {
  const booksQuery = useBookControllerFindAll();
  const books = booksQuery.data ?? [];

  const reviewQueries = useQueries({
    queries: books.map((book) => getReviewControllerFindAllQueryOptions(book.id)),
  });

  const reviewsLoading = reviewQueries.some((q) => q.isLoading);
  const reviewsError = reviewQueries.some((q) => q.isError);

  const isLoading = booksQuery.isLoading || reviewsLoading;
  const isError = booksQuery.isError || reviewsError;

  const dateToBookMap: DateToBookMap = useMemo(() => {
    if (isLoading || isError || books.length === 0) return {};

    const reviewsMap: Record<number, ReviewResponseDto[]> = {};
    books.forEach((book, index) => {
      const queryData = reviewQueries[index]?.data;
      if (queryData) {
        reviewsMap[book.id] = queryData;
      }
    });

    return buildDateToBookMap(books, reviewsMap);
  }, [isLoading, isError, books, reviewQueries]);

  const isEmpty = !isLoading && !isError && Object.keys(dateToBookMap).length === 0;

  const refetch = () => {
    booksQuery.refetch();
    reviewQueries.forEach((q) => q.refetch());
  };

  return {
    dateToBookMap,
    isLoading,
    isError,
    isEmpty,
    refetch,
  };
}
