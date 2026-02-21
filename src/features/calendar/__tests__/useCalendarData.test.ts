import { renderHook } from '@testing-library/react-native';
import { useCalendarData } from '../hooks/useCalendarData';

const mockBooksData = [
  { id: 1, title: '책1', author: 'A', userId: 1, thumbnail: 'thumb1.jpg' },
  { id: 2, title: '책2', author: 'B', userId: 1, thumbnail: null },
];

const mockReviewsBook1 = [
  {
    id: 1,
    title: 'R1',
    content: 'C',
    bookId: 1,
    userId: 1,
    startDate: '2024-01-01',
    endDate: '2024-01-03',
    startPage: 1,
    endPage: 100,
  },
];

const mockReviewsBook2 = [
  {
    id: 2,
    title: 'R2',
    content: 'C',
    bookId: 2,
    userId: 1,
    startDate: '2024-01-02',
    endDate: '2024-01-04',
    startPage: 1,
    endPage: 50,
  },
];

jest.mock('@/api/generated/books/books', () => ({
  useBookControllerFindAll: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    useQueries: jest.fn(),
  };
});

jest.mock('@/api/generated/reviews/reviews', () => ({
  getReviewControllerFindAllQueryOptions: jest.fn((bookId: number) => ({
    queryKey: [`/books/${bookId}/reviews`],
    queryFn: jest.fn(),
  })),
}));

import { useBookControllerFindAll } from '@/api/generated/books/books';
import { useQueries } from '@tanstack/react-query';

const mockUseBookControllerFindAll =
  useBookControllerFindAll as jest.MockedFunction<
    typeof useBookControllerFindAll
  >;
const mockUseQueries = useQueries as jest.MockedFunction<typeof useQueries>;

describe('useCalendarData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로딩 중일 때 isLoading이 true', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    mockUseQueries.mockReturnValue([]);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.dateToBookMap).toEqual({});
  });

  it('에러 발생 시 isError가 true', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as any);

    mockUseQueries.mockReturnValue([]);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.isError).toBe(true);
  });

  it('책과 리뷰 데이터를 날짜별로 매핑', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: mockBooksData,
      isLoading: false,
      isError: false,
    } as any);

    mockUseQueries.mockReturnValue([
      { data: mockReviewsBook1, isLoading: false, isError: false },
      { data: mockReviewsBook2, isLoading: false, isError: false },
    ] as any);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);

    // 1월 1일: 책1만
    expect(result.current.dateToBookMap['2024-01-01']?.books).toHaveLength(1);
    expect(result.current.dateToBookMap['2024-01-01']?.books[0].bookId).toBe(1);

    // 1월 2일: 책1 + 책2
    expect(result.current.dateToBookMap['2024-01-02']?.books).toHaveLength(2);

    // 1월 4일: 책2만
    expect(result.current.dateToBookMap['2024-01-04']?.books).toHaveLength(1);
    expect(result.current.dateToBookMap['2024-01-04']?.books[0].bookId).toBe(2);
  });

  it('리뷰 쿼리 중 하나라도 로딩 중이면 isLoading true', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: mockBooksData,
      isLoading: false,
      isError: false,
    } as any);

    mockUseQueries.mockReturnValue([
      { data: mockReviewsBook1, isLoading: false, isError: false },
      { data: undefined, isLoading: true, isError: false },
    ] as any);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.isLoading).toBe(true);
  });

  it('리뷰 쿼리 중 하나라도 에러면 isError true', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: mockBooksData,
      isLoading: false,
      isError: false,
    } as any);

    mockUseQueries.mockReturnValue([
      { data: mockReviewsBook1, isLoading: false, isError: false },
      { data: undefined, isLoading: false, isError: true },
    ] as any);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.isError).toBe(true);
  });

  it('책 목록이 비어있으면 빈 맵 반환', () => {
    mockUseBookControllerFindAll.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    mockUseQueries.mockReturnValue([] as any);

    const { result } = renderHook(() => useCalendarData());

    expect(result.current.dateToBookMap).toEqual({});
    expect(result.current.isEmpty).toBe(true);
  });
});
