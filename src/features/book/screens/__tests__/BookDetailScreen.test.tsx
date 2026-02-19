import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

// @expo/vector-icons mock
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import { BookDetailScreen } from '../BookDetailScreen';

// --- Mock data ---

const mockBook = {
  id: 1,
  title: '테스트 책',
  author: '테스트 저자',
  publisher: '테스트 출판사',
  thumbnail: 'http://example.com/thumb.jpg',
  userId: 1,
};

const mockReviews = [
  {
    id: 1,
    title: '독후감 1',
    content: '내용 1',
    bookId: 1,
    userId: 1,
    startDate: '2024-01-01',
    endDate: '2024-01-10',
    startPage: 1,
    endPage: 50,
  },
];

// --- Mock functions ---

const mockRefetch = jest.fn();
const mockUpdateMutateAsync = jest.fn();
const mockDeleteMutateAsync = jest.fn();
const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);

let mockFindOneReturn: {
  data: typeof mockBook | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: jest.Mock;
};
let mockUpdateIsPending = false;
let mockReviewsReturn: { data: typeof mockReviews | undefined } = {
  data: mockReviews,
};

// --- Mocks ---

jest.mock('@/api/generated/books/books', () => ({
  useBookControllerFindOne: () => mockFindOneReturn,
  useBookControllerUpdate: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: mockUpdateIsPending,
  }),
  useBookControllerRemove: () => ({
    mutateAsync: mockDeleteMutateAsync,
  }),
  getBookControllerFindOneQueryKey: (id: number) => [`/books/${id}`],
  getBookControllerFindAllQueryKey: () => ['/books'],
}));

jest.mock('@/api/generated/reviews/reviews', () => ({
  useReviewControllerFindAll: () => mockReviewsReturn,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), push: jest.fn() },
  useLocalSearchParams: () => ({ id: '1' }),
}));

jest.mock('@/features/auth/auth-context', () => ({
  useAuth: () => ({ user: { id: 1, email: 'test@test.com' } }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    shelfBrown: '#5D4037',
    shelfDark: '#3E2723',
    shelfHighlight: '#A1887F',
    paper: '#FFF8E1',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    warmWhite: '#FAF3E0',
    contentBg: '#FDFCF0',
    accentGreen: '#558B2F',
    error: '#B71C1C',
  },
  getSpineColor: () => '#8B4513',
}));

jest.mock('@/components/ui/LoadingScreen', () => ({
  LoadingScreen: () => {
    const { Text } = require('react-native');
    return <Text>LoadingScreen</Text>;
  },
}));

jest.mock('@/components/ui/ErrorScreen', () => ({
  ErrorScreen: ({ message, onRetry }: any) => {
    const { View, Text, Pressable } = require('react-native');
    return (
      <View>
        <Text>{message}</Text>
        {onRetry && (
          <Pressable testID="retry-button" onPress={onRetry}>
            <Text>다시 시도</Text>
          </Pressable>
        )}
      </View>
    );
  },
}));

jest.mock('@/components/ui/ConfirmDialog', () => ({
  ConfirmDialog: ({
    visible,
    title,
    message,
    confirmLabel,
    onConfirm,
    onDismiss,
  }: any) => {
    if (!visible) return null;
    const { View, Text, Pressable } = require('react-native');
    return (
      <View testID="confirm-dialog">
        <Text>{title}</Text>
        <Text>{message}</Text>
        <Pressable testID="confirm-button" onPress={onConfirm}>
          <Text>{confirmLabel}</Text>
        </Pressable>
        <Pressable testID="dismiss-button" onPress={onDismiss}>
          <Text>취소</Text>
        </Pressable>
      </View>
    );
  },
}));

// BookEditDialog mock - onSave 콜백 캡처
let mockEditDialogOnSave: ((title: string, author: string) => void) | null =
  null;
jest.mock('../../components/BookEditDialog', () => ({
  BookEditDialog: ({ visible, book, onSave, onDismiss, isLoading }: any) => {
    mockEditDialogOnSave = onSave;
    if (!visible) return null;
    const { View, Text, Pressable } = require('react-native');
    return (
      <View testID="edit-dialog">
        <Text>책 정보 수정</Text>
        <Pressable
          testID="edit-save-button"
          onPress={() => onSave('수정된 제목', '수정된 저자')}
        >
          <Text>저장</Text>
        </Pressable>
        <Pressable testID="edit-dismiss-button" onPress={onDismiss}>
          <Text>취소</Text>
        </Pressable>
      </View>
    );
  },
}));

jest.mock('../../components/BookOpenAnimation', () => ({
  BookOpenAnimation: ({ children }: any) => children,
}));

jest.mock('../../components/BookCover', () => ({
  BookCover: ({ title, author }: any) => {
    const { Text, View } = require('react-native');
    return (
      <View testID="book-cover">
        <Text>{title}</Text>
        <Text>{author}</Text>
      </View>
    );
  },
}));

jest.mock('../../components/BookInfoCard', () => ({
  BookInfoCard: ({ book }: any) => {
    const { Text, View } = require('react-native');
    return (
      <View testID="book-info-card">
        <Text>{book.title}</Text>
        <Text>{book.author}</Text>
        {book.publisher && <Text>{book.publisher}</Text>}
      </View>
    );
  },
}));

jest.mock('@/features/review/components/ReviewList', () => ({
  ReviewList: ({ bookId }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="review-list">
        <Text>독후감 목록</Text>
      </View>
    );
  },
}));

// react-native-paper: Appbar + Snackbar + FAB
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Appbar: {
      Header: ({ children, ...rest }: any) => (
        <RN.View {...rest}>{children}</RN.View>
      ),
      BackAction: ({ onPress }: any) => (
        <RN.Pressable testID="back-button" onPress={onPress}>
          <RN.Text>뒤로</RN.Text>
        </RN.Pressable>
      ),
      Content: ({ title }: any) => (
        <RN.Text testID="header-title">{title}</RN.Text>
      ),
      Action: ({ icon, onPress }: any) => (
        <RN.Pressable testID={`action-${icon}`} onPress={onPress}>
          <RN.Text>{icon}</RN.Text>
        </RN.Pressable>
      ),
    },
    FAB: ({ onPress, accessibilityLabel }: any) => (
      <RN.Pressable
        testID="fab-add-review"
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      >
        <RN.Text>+</RN.Text>
      </RN.Pressable>
    ),
    Snackbar: ({ visible, children }: any) => {
      if (!visible) return null;
      return <RN.Text testID="snackbar">{children}</RN.Text>;
    },
    Text: RN.Text,
  };
});

const { router } = require('expo-router');

// --- Setup ---

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdateIsPending = false;
  mockEditDialogOnSave = null;
  mockReviewsReturn = { data: mockReviews };
  mockFindOneReturn = {
    data: mockBook,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  };
});

// --- Tests ---

describe('BookDetailScreen', () => {
  describe('로딩 상태', () => {
    it('로딩 중이면 LoadingScreen을 표시한다', () => {
      mockFindOneReturn = {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      };

      render(<BookDetailScreen />);

      expect(screen.getByText('LoadingScreen')).toBeTruthy();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 ErrorScreen을 표시한다', () => {
      mockFindOneReturn = {
        data: undefined,
        isLoading: false,
        error: new Error('Network Error'),
        refetch: mockRefetch,
      };

      render(<BookDetailScreen />);

      expect(
        screen.getByText('책 정보를 불러올 수 없습니다.'),
      ).toBeTruthy();
    });

    it('데이터가 없으면 ErrorScreen을 표시한다', () => {
      mockFindOneReturn = {
        data: undefined,
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };

      render(<BookDetailScreen />);

      expect(
        screen.getByText('책 정보를 불러올 수 없습니다.'),
      ).toBeTruthy();
    });

    it('재시도 버튼을 누르면 refetch를 호출한다', () => {
      mockFindOneReturn = {
        data: undefined,
        isLoading: false,
        error: new Error('Network Error'),
        refetch: mockRefetch,
      };

      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  describe('정상 렌더링', () => {
    it('헤더에 "책 상세"가 표시된다', () => {
      render(<BookDetailScreen />);

      expect(screen.getByTestId('header-title')).toHaveTextContent('책 상세');
    });

    it('책 표지가 렌더링된다', () => {
      render(<BookDetailScreen />);

      expect(screen.getByTestId('book-cover')).toBeTruthy();
    });

    it('ReviewList가 렌더링된다', () => {
      render(<BookDetailScreen />);

      expect(screen.getByTestId('review-list')).toBeTruthy();
    });

    it('마지막 읽은 페이지가 표시된다', () => {
      render(<BookDetailScreen />);

      expect(screen.getByText(/p\.50/)).toBeTruthy();
    });
  });

  describe('네비게이션', () => {
    it('뒤로가기 버튼을 누르면 router.back이 호출된다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('back-button'));

      expect(router.back).toHaveBeenCalled();
    });

    it('FAB을 누르면 리뷰 생성 페이지로 이동한다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('fab-add-review'));

      expect(router.push).toHaveBeenCalledWith(
        '/(main)/(bookshelf)/review/create?bookId=1',
      );
    });
  });

  describe('수정', () => {
    it('연필 아이콘을 누르면 수정 다이얼로그가 열린다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-pencil'));

      expect(screen.getByTestId('edit-dialog')).toBeTruthy();
      expect(screen.getByText('책 정보 수정')).toBeTruthy();
    });

    it('수정 저장 성공 시 쿼리를 무효화하고 스낵바를 표시한다', async () => {
      mockUpdateMutateAsync.mockResolvedValueOnce({});
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-pencil'));
      fireEvent.press(screen.getByTestId('edit-save-button'));

      await waitFor(() => {
        expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
          id: 1,
          data: { title: '수정된 제목', author: '수정된 저자' },
        });
      });

      await waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['/books/1'],
        });
      });

      await waitFor(() => {
        expect(screen.getByText('수정되었습니다.')).toBeTruthy();
      });
    });

    it('수정 실패 시 에러 스낵바를 표시한다', async () => {
      mockUpdateMutateAsync.mockRejectedValueOnce(new Error('fail'));
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-pencil'));
      fireEvent.press(screen.getByTestId('edit-save-button'));

      await waitFor(() => {
        expect(screen.getByText('수정에 실패했습니다.')).toBeTruthy();
      });
    });

    it('수정 취소 시 다이얼로그가 닫힌다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-pencil'));
      expect(screen.getByTestId('edit-dialog')).toBeTruthy();

      fireEvent.press(screen.getByTestId('edit-dismiss-button'));

      expect(screen.queryByTestId('edit-dialog')).toBeNull();
    });
  });

  describe('삭제', () => {
    it('삭제 아이콘을 누르면 삭제 확인 다이얼로그가 열린다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-delete'));

      expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
      expect(screen.getByText('책 삭제')).toBeTruthy();
      expect(
        screen.getByText(
          '"테스트 책"을(를) 삭제하시겠습니까?\n관련 독후감도 함께 삭제됩니다.',
        ),
      ).toBeTruthy();
    });

    it('삭제 확인 시 mutateAsync를 호출하고 뒤로 이동한다', async () => {
      mockDeleteMutateAsync.mockResolvedValueOnce(undefined);
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-delete'));
      fireEvent.press(screen.getByTestId('confirm-button'));

      await waitFor(() => {
        expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ id: 1 });
      });

      await waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['/books'],
        });
      });

      await waitFor(() => {
        expect(router.back).toHaveBeenCalled();
      });
    });

    it('삭제 실패 시 에러 스낵바를 표시한다', async () => {
      mockDeleteMutateAsync.mockRejectedValueOnce(new Error('fail'));
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-delete'));
      fireEvent.press(screen.getByTestId('confirm-button'));

      await waitFor(() => {
        expect(screen.getByText('삭제에 실패했습니다.')).toBeTruthy();
      });
    });

    it('삭제 취소 시 다이얼로그가 닫힌다', () => {
      render(<BookDetailScreen />);

      fireEvent.press(screen.getByTestId('action-delete'));
      expect(screen.getByTestId('confirm-dialog')).toBeTruthy();

      fireEvent.press(screen.getByTestId('dismiss-button'));

      expect(screen.queryByTestId('confirm-dialog')).toBeNull();
    });
  });
});
