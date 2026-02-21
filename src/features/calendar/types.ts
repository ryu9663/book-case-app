import type { CreateReviewDtoSticker } from '@/api/generated/models';

export interface CalendarBookInfo {
  bookId: number;
  title: string;
  author: string;
  thumbnail: string | null | undefined;
  reviewId: number;
  reviewTitle: string;
  reviewContent: string;
  startPage: number;
  endPage: number;
  sticker?: CreateReviewDtoSticker;
}

export interface CalendarDayData {
  books: CalendarBookInfo[];
}

export type DateToBookMap = Record<string, CalendarDayData>;
