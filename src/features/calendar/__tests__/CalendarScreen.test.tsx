import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarScreen } from '../screens/CalendarScreen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockRefetch = jest.fn();

jest.mock('../hooks/useCalendarData', () => ({
  useCalendarData: jest.fn(),
}));

jest.mock('react-native-calendars', () => {
  const { View, Text } = require('react-native');
  return {
    Calendar: ({ dayComponent, ...rest }: any) => (
      <View testID="mock-calendar">
        <Text>Calendar</Text>
      </View>
    ),
    LocaleConfig: {
      locales: {},
      defaultLocale: '',
    },
  };
});

import { useCalendarData } from '../hooks/useCalendarData';

const mockUseCalendarData = useCalendarData as jest.MockedFunction<
  typeof useCalendarData
>;

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
      dateToBookMap: {
        '2024-01-15': {
          books: [{ bookId: 1, title: '책1', thumbnail: null }],
        },
      },
      isLoading: false,
      isError: false,
      isEmpty: false,
      refetch: mockRefetch,
    });

    const { getByTestId } = render(<CalendarScreen />);

    expect(getByTestId('mock-calendar')).toBeTruthy();
  });
});
