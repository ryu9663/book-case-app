export interface CalendarBookInfo {
  bookId: number;
  title: string;
  author: string;
  thumbnail: string | null | undefined;
}

export interface CalendarDayData {
  books: CalendarBookInfo[];
}

export type DateToBookMap = Record<string, CalendarDayData>;
