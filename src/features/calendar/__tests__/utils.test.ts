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

  let reviewIdCounter = 1;
  const makeReview = (
    bookId: number,
    startDate: string,
    endDate: string,
    overrides?: Partial<ReviewResponseDto>,
  ): ReviewResponseDto => ({
    id: reviewIdCounter++,
    title: 'Review',
    content: 'Content',
    bookId,
    userId: 1,
    startDate,
    endDate,
    startPage: 1,
    endPage: 100,
    ...overrides,
  });

  beforeEach(() => {
    reviewIdCounter = 1;
  });

  it('리뷰가 없으면 빈 맵 반환', () => {
    const result = buildDateToBookMap([makeBook(1, '책1')], { 1: [] });
    expect(result).toEqual({});
  });

  it('하나의 책, 하나의 리뷰 → 해당 날짜 범위에 책 정보 매핑', () => {
    const books = [makeBook(1, '책1', 'thumb.jpg')];
    const reviewsMap = { 1: [makeReview(1, '2024-01-01', '2024-01-03')] };

    const result = buildDateToBookMap(books, reviewsMap);

    const expected = {
      bookId: 1,
      title: '책1',
      author: 'Author',
      thumbnail: 'thumb.jpg',
      reviewId: 1,
      reviewTitle: 'Review',
      reviewContent: 'Content',
      startPage: 1,
      endPage: 100,
    };
    expect(result['2024-01-01']?.books).toEqual([expected]);
    expect(result['2024-01-02']?.books).toEqual([expected]);
    expect(result['2024-01-03']?.books).toEqual([expected]);
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

  it('같은 책에 여러 리뷰가 있으면 리뷰별로 별도 표시', () => {
    const books = [makeBook(1, '책1')];
    const reviewsMap = {
      1: [
        makeReview(1, '2024-01-01', '2024-01-02'),
        makeReview(1, '2024-01-02', '2024-01-03'),
      ],
    };

    const result = buildDateToBookMap(books, reviewsMap);

    // 1월 2일에 두 리뷰가 겹치므로 같은 책이라도 2개 엔트리
    expect(result['2024-01-02']?.books).toHaveLength(2);
    expect(result['2024-01-01']?.books).toHaveLength(1);
    expect(result['2024-01-03']?.books).toHaveLength(1);
  });

  it('reviewsMap에 없는 bookId는 무시', () => {
    const books = [makeBook(1, '책1'), makeBook(2, '책2')];
    const reviewsMap = {
      1: [makeReview(1, '2024-01-01', '2024-01-01')],
    };

    const result = buildDateToBookMap(books, reviewsMap);

    expect(result['2024-01-01']?.books).toHaveLength(1);
  });

  it('bookInfo에 author와 review 필드가 포함됨', () => {
    const books = [makeBook(1, '책1', 'thumb.jpg')];
    const reviewsMap = {
      1: [
        makeReview(1, '2024-01-01', '2024-01-01', {
          title: '좋은 책',
          content: '인상 깊었다',
          startPage: 10,
          endPage: 50,
        }),
      ],
    };

    const result = buildDateToBookMap(books, reviewsMap);
    const entry = result['2024-01-01']?.books[0];

    expect(entry).toHaveProperty('author', 'Author');
    expect(entry).toHaveProperty('reviewTitle', '좋은 책');
    expect(entry).toHaveProperty('reviewContent', '인상 깊었다');
    expect(entry).toHaveProperty('startPage', 10);
    expect(entry).toHaveProperty('endPage', 50);
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
