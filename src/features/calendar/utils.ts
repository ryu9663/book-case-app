import { BookResponseDto, ReviewResponseDto } from '@/api/generated/models';
import { CalendarBookInfo, DateToBookMap } from './types';

export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function buildDateToBookMap(
  books: BookResponseDto[],
  reviewsMap: Record<number, ReviewResponseDto[]>,
): DateToBookMap {
  const result: DateToBookMap = {};
  const bookMap = new Map(books.map((b) => [b.id, b]));

  for (const [bookIdStr, reviews] of Object.entries(reviewsMap)) {
    const bookId = Number(bookIdStr);
    const book = bookMap.get(bookId);
    if (!book || !reviews.length) continue;

    const bookInfo: CalendarBookInfo = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      thumbnail: book.thumbnail,
    };

    for (const review of reviews) {
      const dates = getDateRange(review.startDate, review.endDate);
      for (const date of dates) {
        if (!result[date]) {
          result[date] = { books: [] };
        }
        const alreadyAdded = result[date].books.some(
          (b) => b.bookId === bookId,
        );
        if (!alreadyAdded) {
          result[date].books.push(bookInfo);
        }
      }
    }
  }

  return result;
}

export function formatKoreanDate(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}
