import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarScreen } from '../screens/CalendarScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    cream: '#F5F5DC',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    shelfBrown: '#5D4037',
    warmWhite: '#FAF3E0',
  },
  getSpineColor: () => '#AA5533',
}));

const mockRefetch = jest.fn();

jest.mock('../hooks/useCalendarData', () => ({
  useCalendarData: jest.fn(),
}));

jest.mock('react-native-calendars', () => {
  const { View, Text, Pressable } = require('react-native');
  return {
    Calendar: ({ dayComponent: DayComponent }: any) => {
      const dates = [
        { dateString: '2024-01-15', day: 15, month: 1, year: 2024, timestamp: 0 },
        { dateString: '2024-01-16', day: 16, month: 1, year: 2024, timestamp: 0 },
      ];
      return (
        <View testID="mock-calendar">
          {dates.map((date) =>
            DayComponent ? (
              <DayComponent key={date.dateString} date={date} state="" />
            ) : null,
          )}
        </View>
      );
    },
    LocaleConfig: {
      locales: {},
      defaultLocale: '',
    },
  };
});

jest.mock('../components/CalendarThumbnail', () => ({
  CalendarThumbnail: ({ title }: any) => {
    const { View } = require('react-native');
    return <View testID={`thumb-${title}`} />;
  },
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: any[]) => mockPush(...args) },
}));

import { useCalendarData } from '../hooks/useCalendarData';

const mockUseCalendarData = useCalendarData as jest.MockedFunction<
  typeof useCalendarData
>;

const dateToBookMapWithData = {
  '2024-01-15': {
    books: [
      {
        bookId: 1,
        title: '책1',
        author: '저자1',
        thumbnail: 'thumb.jpg',
        reviewId: 10,
        reviewTitle: '독후감1',
        reviewContent: '내용1',
        startPage: 1,
        endPage: 50,
      },
      {
        bookId: 2,
        title: '책2',
        author: '저자2',
        thumbnail: null,
        reviewId: 20,
        reviewTitle: '독후감2',
        reviewContent: '내용2',
        startPage: 1,
        endPage: 100,
      },
    ],
  },
  '2024-01-16': {
    books: [
      {
        bookId: 3,
        title: '책3',
        author: '저자3',
        thumbnail: null,
        reviewId: 30,
        reviewTitle: '독후감3',
        reviewContent: '내용3',
        startPage: 1,
        endPage: 200,
      },
    ],
  },
};

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('로딩 중일 때 LoadingScreen 표시', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: {},
      isLoading: true,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    expect(getByText('독서 기록을 불러오는 중...')).toBeTruthy();
  });

  it('에러 발생 시 ErrorScreen 표시', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: {},
      isLoading: false,
      isError: true,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    expect(getByText('독서 기록을 불러오는 데 실패했습니다.')).toBeTruthy();
  });

  it('데이터가 비어있을 때 EmptyState 표시', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: {},
      isLoading: false,
      isError: false,
      isEmpty: true,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    expect(getByText('독서 기록이 없습니다')).toBeTruthy();
  });

  it('데이터가 있을 때 Calendar 렌더링', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByTestId } = render(<CalendarScreen />);

    expect(getByTestId('mock-calendar')).toBeTruthy();
  });

  it('초기 상태에서 DayBookList가 보이지 않음', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { queryByText } = render(<CalendarScreen />);

    expect(queryByText('2024년 1월 15일')).toBeNull();
  });

  it('날짜를 탭하면 해당 날짜의 책 목록이 표시됨', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('15'));

    expect(getByText('2024년 1월 15일')).toBeTruthy();
    expect(getByText('책1')).toBeTruthy();
    expect(getByText('저자1')).toBeTruthy();
  });

  it('같은 날짜를 다시 탭하면 목록이 사라짐 (토글)', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText, queryByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('15'));
    expect(getByText('2024년 1월 15일')).toBeTruthy();

    fireEvent.press(getByText('15'));
    expect(queryByText('2024년 1월 15일')).toBeNull();
  });

  it('다른 날짜를 탭하면 새 날짜의 책 목록으로 전환', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText, queryByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('15'));
    expect(getByText('책1')).toBeTruthy();

    fireEvent.press(getByText('16'));
    expect(queryByText('책1')).toBeNull();
    expect(getByText('책3')).toBeTruthy();
    expect(getByText('2024년 1월 16일')).toBeTruthy();
  });

  it('책을 탭하면 BookDetail로 네비게이션', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: dateToBookMapWithData,
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('15'));
    fireEvent.press(getByText('책1'));

    expect(mockPush).toHaveBeenCalledWith(
      '/(main)/(bookshelf)/review/10?bookId=1',
    );
  });

  it('데이터가 없는 날짜를 탭하면 빈 상태 메시지 표시', () => {
    mockUseCalendarData.mockReturnValue({
      dateToBookMap: {},
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByText } = render(<CalendarScreen />);

    fireEvent.press(getByText('15'));
    expect(getByText('이 날 읽은 책이 없습니다')).toBeTruthy();
  });
});
