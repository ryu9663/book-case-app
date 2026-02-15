import { render, screen, fireEvent } from '@testing-library/react-native';
import { ReviewCard } from '../ReviewCard';
import type { ReviewResponseDto } from '@/api/generated/models';

// --- Mocks ---

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    warmWhite: '#FAF3E0',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
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
  it('제목, 내용, 날짜, 페이지 범위가 렌더링된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText('테스트 독후감')).toBeTruthy();
    expect(
      screen.getByText('이 책은 정말 흥미로웠습니다. 많은 것을 배웠습니다.'),
    ).toBeTruthy();
    expect(screen.getByText(/2026\.01\.15 ~ 2026\.02\.15/)).toBeTruthy();
    expect(screen.getByText('p.1 - p.150')).toBeTruthy();
  });

  it('날짜 형식이 YYYY.MM.DD로 변환된다', () => {
    const review = { ...mockReview, startDate: '2025-03-05', endDate: '2025-12-25' };
    render(
      <ReviewCard review={review} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(screen.getByText(/2025\.03\.05 ~ 2025\.12\.25/)).toBeTruthy();
  });

  it('편집 버튼을 누르면 onEdit이 호출된다', () => {
    render(
      <ReviewCard
        review={mockReview}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

    const editButtons = screen.getAllByRole('button');
    // pencil 아이콘 버튼이 첫 번째
    fireEvent.press(editButtons[0]);

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

    const deleteButtons = screen.getAllByRole('button');
    // delete 아이콘 버튼이 두 번째
    fireEvent.press(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('페이지 범위가 올바르게 표시된다', () => {
    const review = { ...mockReview, startPage: 50, endPage: 300 };
    render(
      <ReviewCard review={review} onEdit={mockOnEdit} onDelete={mockOnDelete} />,
    );

    expect(screen.getByText('p.50 - p.300')).toBeTruthy();
  });
});
