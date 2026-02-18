import { BookResponseDto, ReviewResponseDto } from '@/api/generated/models';
import { getDateRange, buildDateToBookMap, formatKoreanDate } from '../utils';

describe('getDateRange', () => {
  it('같은 날짜면 해당 날짜 하나만 반환', () => {
    expect(getDateRange('2024-01-15', '2024-01-15')).toEqual(['2024-01-15']);
  });

  it('연속된 날짜 범위를 반환', () => {
    expect(getDateRange('2024-01-01', '2024-01-03')).toEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
    ]);
  });

  it('월을 넘어가는 범위를 올바르게 처리', () => {
    const range = getDateRange('2024-01-30', '2024-02-02');
    expect(range).toEqual([
      '2024-01-30',
      '2024-01-31',
      '2024-02-01',
      '2024-02-02',
    ]);
  });

  it('startDate가 endDate보다 늦으면 빈 배열 반환', () => {
    expect(getDateRange('2024-01-05', '2024-01-01')).toEqual([]);
  });
});

describe('buildDateToBookMap', () => {
  const makeBook = (
    id: number,
    title: string,
    thumbnail?: string | null,
  ): BookResponseDto => ({
    id,
    title,
    author: 'Author',
    userId: 1,
    thumbnail: thumbnail ?? null,
  });

  const makeReview = (
    bookId: number,
    startDate: string,
    endDate: string,
  ): ReviewResponseDto => ({
    id: 1,
    title: 'Review',
    content: 'Content',
    bookId,
    userId: 1,
    startDate,
    endDate,
    startPage: 1,
    endPage: 100,
  });

  it('리뷰가 없으면 빈 맵 반환', () => {
    const result = buildDateToBookMap([makeBook(1, '책1')], { 1: [] });
    expect(result).toEqual({});
  });

  it('하나의 책, 하나의 리뷰 → 해당 날짜 범위에 책 정보 매핑', () => {
    const books = [makeBook(1, '책1', 'thumb.jpg')];
    const reviewsMap = { 1: [makeReview(1, '2024-01-01', '2024-01-03')] };

    const result = buildDateToBookMap(books, reviewsMap);

    expect(result['2024-01-01']?.books).toEqual([
      { bookId: 1, title: '책1', author: 'Author', thumbnail: 'thumb.jpg' },
    ]);
    expect(result['2024-01-02']?.books).toEqual([
      { bookId: 1, title: '책1', author: 'Author', thumbnail: 'thumb.jpg' },
    ]);
    expect(result['2024-01-03']?.books).toEqual([
      { bookId: 1, title: '책1', author: 'Author', thumbnail: 'thumb.jpg' },
    ]);
    expect(result['2024-01-04']).toBeUndefined();
  });

  it('같은 날짜에 여러 책이 겹치면 모두 포함', () => {
    const books = [makeBook(1, '책1'), makeBook(2, '책2')];
    const reviewsMap = {
      1: [makeReview(1, '2024-01-01', '2024-01-02')],
      2: [makeReview(2, '2024-01-02', '2024-01-03')],
    };

    const result = buildDateToBookMap(books, reviewsMap);

    expect(result['2024-01-01']?.books).toHaveLength(1);
    expect(result['2024-01-02']?.books).toHaveLength(2);
    expect(result['2024-01-03']?.books).toHaveLength(1);
  });

  it('같은 책에 여러 리뷰가 있어도 날짜별로 중복 없이 매핑', () => {
    const books = [makeBook(1, '책1')];
    const reviewsMap = {
      1: [
        makeReview(1, '2024-01-01', '2024-01-02'),
        makeReview(1, '2024-01-02', '2024-01-03'),
      ],
    };

    const result = buildDateToBookMap(books, reviewsMap);

    // 1월 2일에 두 리뷰가 겹치지만 같은 책이므로 한 번만 등장
    expect(result['2024-01-02']?.books).toHaveLength(1);
  });

  it('reviewsMap에 없는 bookId는 무시', () => {
    const books = [makeBook(1, '책1'), makeBook(2, '책2')];
    const reviewsMap = {
      1: [makeReview(1, '2024-01-01', '2024-01-01')],
    };

    const result = buildDateToBookMap(books, reviewsMap);

    expect(result['2024-01-01']?.books).toHaveLength(1);
  });

  it('bookInfo에 author가 포함됨', () => {
    const books = [makeBook(1, '책1', 'thumb.jpg')];
    const reviewsMap = { 1: [makeReview(1, '2024-01-01', '2024-01-01')] };

    const result = buildDateToBookMap(books, reviewsMap);

    expect(result['2024-01-01']?.books[0]).toHaveProperty('author', 'Author');
  });
});

describe('formatKoreanDate', () => {
  it('"2024-01-15" → "2024년 1월 15일"', () => {
    expect(formatKoreanDate('2024-01-15')).toBe('2024년 1월 15일');
  });

  it('앞자리 0을 제거', () => {
    expect(formatKoreanDate('2024-03-05')).toBe('2024년 3월 5일');
  });

  it('12월 31일 처리', () => {
    expect(formatKoreanDate('2024-12-31')).toBe('2024년 12월 31일');
  });
});
