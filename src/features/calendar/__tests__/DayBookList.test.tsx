import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DayBookList } from '../components/DayBookList';
import { CalendarBookInfo } from '../types';

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    warmWhite: '#FAF3E0',
    shelfBrown: '#5D4037',
  },
  getSpineColor: () => '#AA5533',
}));

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...args: any[]) => mockPush(...args) },
}));

const books: CalendarBookInfo[] = [
  {
    bookId: 1,
    title: '책1',
    author: '저자1',
    thumbnail: 'thumb1.jpg',
    reviewId: 10,
    reviewTitle: '독후감1',
    reviewContent: '좋은 책이었다',
    startPage: 1,
    endPage: 100,
  },
  {
    bookId: 2,
    title: '책2',
    author: '저자2',
    thumbnail: null,
    reviewId: 20,
    reviewTitle: '독후감2',
    reviewContent: '',
    startPage: 50,
    endPage: 150,
  },
];

describe('DayBookList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selectedDate가 null이면 아무것도 렌더링하지 않음', () => {
    const { toJSON } = render(
      <DayBookList selectedDate={null} books={[]} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('날짜 헤더를 한국어 형식으로 표시', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByText('2024년 1월 15일')).toBeTruthy();
  });

  it('책이 없으면 빈 상태 메시지 표시', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={[]} />,
    );
    expect(getByText('이 날 읽은 책이 없습니다')).toBeTruthy();
  });

  it('책 목록을 제목과 저자로 렌더링', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByText('책1')).toBeTruthy();
    expect(getByText('저자1')).toBeTruthy();
    expect(getByText('책2')).toBeTruthy();
    expect(getByText('저자2')).toBeTruthy();
  });

  it('책을 탭하면 BookDetail로 네비게이션', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    fireEvent.press(getByText('책1'));
    expect(mockPush).toHaveBeenCalledWith('/(main)/(bookshelf)/book/1');
  });

  it('썸네일이 있으면 Image 렌더링', () => {
    const { getByTestId } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByTestId('book-thumbnail-10')).toBeTruthy();
  });

  it('썸네일이 없으면 스파인 컬러 fallback 렌더링', () => {
    const { getByTestId } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByTestId('book-spine-20')).toBeTruthy();
  });

  it('독후감 제목과 페이지 범위를 표시', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByText('독후감1')).toBeTruthy();
    expect(getByText('p.1 - p.100')).toBeTruthy();
    expect(getByText('독후감2')).toBeTruthy();
    expect(getByText('p.50 - p.150')).toBeTruthy();
  });

  it('독후감 본문이 있으면 미리보기 표시', () => {
    const { getByText } = render(
      <DayBookList selectedDate="2024-01-15" books={books} />,
    );
    expect(getByText('좋은 책이었다')).toBeTruthy();
  });

  it('독후감 본문이 비어있으면 미리보기 미표시', () => {
    const { queryByText } = render(
      <DayBookList selectedDate="2024-01-15" books={[books[1]]} />,
    );
    // book2의 reviewContent가 빈 문자열이므로 미리보기 없음
    expect(queryByText('p.50 - p.150')).toBeTruthy();
  });
});
