import { render, screen, fireEvent } from '@testing-library/react-native';
import { ReviewCard } from '../ReviewCard';
import type { ReviewResponseDto } from '@/api/generated/models';

// --- Mocks ---

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    warmWhite: '#FAF3E0',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    accentGreen: '#558B2F',
  },
}));

const mockReview: ReviewResponseDto = {
  id: 1,
  title: '테스트 독후감',
  content: '이 책은 정말 흥미로웠습니다. 많은 것을 배웠습니다.',
  bookId: 10,
  userId: 1,
  startDate: '2026-01-15',
  endDate: '2026-02-15',
  startPage: 1,
  endPage: 150,
};

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Tests ---

describe('ReviewCard', () => {
  it('날짜, 내용, 페이지 범위가 렌더링된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('2026년 2월 15일')).toBeTruthy();
    expect(screen.getByText(/이 책은 정말 흥미로웠습니다/)).toBeTruthy();
    expect(screen.getByText('p.1–150')).toBeTruthy();
  });

  it('날짜 형식이 YYYY년 M월 D일로 변환된다', () => {
    const review = {
      ...mockReview,
      startDate: '2025-03-05',
      endDate: '2025-12-25',
    };
    render(
      <ReviewCard
        review={review}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('2025년 12월 25일')).toBeTruthy();
  });

  it('카드를 누르면 onEdit이 호출된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(screen.getByText(/이 책은 정말 흥미로웠습니다/));

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('삭제 버튼을 누르면 onDelete가 호출된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.press(screen.getByLabelText('독후감 삭제'));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('페이지 범위가 올바르게 표시된다', () => {
    const review = { ...mockReview, startPage: 50, endPage: 300 };
    render(
      <ReviewCard
        review={review}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('p.50–300')).toBeTruthy();
  });

  it('내용이 3줄로 제한된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    const content = screen.getByTestId('review-content');
    expect(content.props.numberOfLines).toBe(3);
  });

  describe('접근성', () => {
    it('삭제 버튼에 accessibilityLabel이 있다', () => {
      render(
        <ReviewCard
          review={mockReview}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByLabelText('독후감 삭제')).toBeTruthy();
    });
  });
});
