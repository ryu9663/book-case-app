import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarDayCell } from '../components/CalendarDayCell';
import { CalendarDayData } from '../types';

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    textPrimary: '#3E2723',
    textMuted: '#8D6E63',
    shelfBrown: '#5D4037',
    cream: '#F5F5DC',
  },
  getSpineColor: (title: string) => '#AA5533',
}));

jest.mock('../components/CalendarThumbnail', () => ({
  CalendarThumbnail: ({ title, thumbnail }: any) => {
    const { View } = require('react-native');
    return <View testID={`thumb-${title}`} />;
  },
}));

const baseDate = {
  dateString: '2024-01-15',
  day: 15,
  month: 1,
  year: 2024,
  timestamp: 0,
};

describe('CalendarDayCell', () => {
  it('날짜 숫자를 렌더링', () => {
    const { getByText } = render(
      <CalendarDayCell date={baseDate} state="" dateToBookMap={{}} />,
    );

    expect(getByText('15')).toBeTruthy();
  });

  it('데이터가 없으면 썸네일 없이 날짜만 표시', () => {
    const { queryByTestId, getByText } = render(
      <CalendarDayCell date={baseDate} state="" dateToBookMap={{}} />,
    );

    expect(getByText('15')).toBeTruthy();
    expect(queryByTestId('thumb-책1')).toBeNull();
  });

  it('해당 날짜에 책이 있으면 썸네일 렌더링', () => {
    const dateToBookMap: Record<string, CalendarDayData> = {
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
    };

    const { getByTestId } = render(
      <CalendarDayCell
        date={baseDate}
        state=""
        dateToBookMap={dateToBookMap}
      />,
    );

    expect(getByTestId('thumb-책1')).toBeTruthy();
    expect(getByTestId('thumb-책2')).toBeTruthy();
  });

  it('7개 초과 시 최대 7개 + "+N" 텍스트 표시', () => {
    const books = Array.from({ length: 9 }, (_, i) => ({
      bookId: i + 1,
      title: `책${i + 1}`,
      author: `저자${i + 1}`,
      thumbnail: null,
      reviewId: 100 + i,
      reviewTitle: `독후감${i + 1}`,
      reviewContent: `내용${i + 1}`,
      startPage: 1,
      endPage: 50,
    }));

    const dateToBookMap: Record<string, CalendarDayData> = {
      '2024-01-15': { books },
    };

    const { getByText, queryByTestId } = render(
      <CalendarDayCell
        date={baseDate}
        state=""
        dateToBookMap={dateToBookMap}
      />,
    );

    // 7개만 렌더링
    expect(queryByTestId('thumb-책1')).toBeTruthy();
    expect(queryByTestId('thumb-책7')).toBeTruthy();
    expect(queryByTestId('thumb-책8')).toBeNull();

    // +2 표시
    expect(getByText('+2')).toBeTruthy();
  });

  it('disabled 상태일 때 날짜 텍스트가 muted 색상', () => {
    const { getByText } = render(
      <CalendarDayCell date={baseDate} state="disabled" dateToBookMap={{}} />,
    );

    const dayText = getByText('15');
    expect(dayText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: '#8D6E63' }),
      ]),
    );
  });

  it('today 상태일 때 오늘 스타일 적용', () => {
    const { getByTestId } = render(
      <CalendarDayCell date={baseDate} state="today" dateToBookMap={{}} />,
    );

    expect(getByTestId('calendar-day-cell-today')).toBeTruthy();
  });

  it('onPress 호출 시 dateString 전달', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CalendarDayCell
        date={baseDate}
        state=""
        dateToBookMap={{}}
        onPress={onPress}
      />,
    );

    fireEvent.press(getByText('15'));
    expect(onPress).toHaveBeenCalledWith('2024-01-15');
  });

  it('onPress가 없으면 터치해도 에러 없음', () => {
    const { getByText } = render(
      <CalendarDayCell date={baseDate} state="" dateToBookMap={{}} />,
    );

    expect(() => fireEvent.press(getByText('15'))).not.toThrow();
  });

  it('isSelected일 때 선택 스타일 적용', () => {
    const { getByTestId } = render(
      <CalendarDayCell
        date={baseDate}
        state=""
        dateToBookMap={{}}
        isSelected
      />,
    );

    const container = getByTestId('calendar-day-cell-selected');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: '#5D4037' }),
      ]),
    );
  });
});
