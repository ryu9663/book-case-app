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
}

export interface CalendarDayData {
  books: CalendarBookInfo[];
}

export type DateToBookMap = Record<string, CalendarDayData>;
