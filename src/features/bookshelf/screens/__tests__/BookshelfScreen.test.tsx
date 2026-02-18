import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

// @expo/vector-icons mock - expo-font/expo-asset 의존성 방지
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

import { BookshelfScreen } from '../BookshelfScreen';

// --- Mock data ---

const mockBooks = [
  { id: 1, isbn: '9781234567890', title: '테스트 책 1', author: '저자 1', thumbnail: 'http://example.com/thumb1.jpg', userId: 1 },
  { id: 2, isbn: '9781234567891', title: '테스트 책 2', author: '저자 2', thumbnail: null, userId: 1 },
];

// --- Mock functions ---

const mockRefetch = jest.fn();
const mockDeleteMutateAsync = jest.fn();
const mockInvalidateQueries = jest.fn();

let mockFindAllReturn: {
  data: typeof mockBooks | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: jest.Mock;
};

// --- Mocks ---

jest.mock('@/api/generated/books/books', () => ({
  useBookControllerFindAll: () => mockFindAllReturn,
  useBookControllerRemove: () => ({
    mutateAsync: mockDeleteMutateAsync,
  }),
  getBookControllerFindAllQueryKey: () => ['/books'],
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    shelfBg: '#D2B48C',
    headerBg: '#3E2723',
    contentBg: '#FFF8F0',
    shelfPlank: '#8B5E3C',
    shelfPlankSide: '#5D4636',
    textPrimary: '#000',
    textSecondary: '#666',
    textMuted: '#999',
    shelfBrown: '#5D4037',
    shelfDark: '#3E2723',
    paper: '#FFF',
    cream: '#FFF8F0',
  },
  getSpineColor: () => '#8B4513',
}));

// ConfirmDialog mock - Portal 없이 간단한 렌더링
jest.mock('@/components/ui/ConfirmDialog', () => ({
  ConfirmDialog: ({ visible, title, message, confirmLabel, onConfirm, onDismiss }: any) => {
    if (!visible) return null;
    const { View, Text, Pressable } = require('react-native');
    return (
      <View testID="confirm-dialog">
        <Text>{title}</Text>
        <Text>{message}</Text>
        <Pressable testID="confirm-delete-button" onPress={onConfirm}>
          <Text>{confirmLabel}</Text>
        </Pressable>
        <Pressable testID="dismiss-delete-button" onPress={onDismiss}>
          <Text>취소</Text>
        </Pressable>
      </View>
    );
  },
}));

jest.mock('@/components/ui/LoadingScreen', () => ({
  LoadingScreen: () => {
    const { Text } = require('react-native');
    return <Text>로딩 중...</Text>;
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

jest.mock('../../components/BookCover', () => ({
  BookCover: ({ book, onPress, onLongPress }: any) => {
    const { Pressable, Text } = require('react-native');
    return (
      <Pressable testID={`book-${book.id}`} onPress={onPress} onLongPress={onLongPress}>
        <Text>{book.title}</Text>
      </Pressable>
    );
  },
}));

// react-native-paper Snackbar mock
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Text: RN.Text,
    Snackbar: ({ visible, children }: any) => {
      if (!visible) return null;
      return <RN.Text testID="snackbar">{children}</RN.Text>;
    },
  };
});

const { router } = require('expo-router');

// --- Setup ---

beforeEach(() => {
  jest.clearAllMocks();
  mockFindAllReturn = {
    data: mockBooks,
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  };
});

// --- Tests ---

describe('BookshelfScreen', () => {
  // ===== Read (조회) =====

  describe('책 목록 조회', () => {
    it('책 목록이 렌더링된다', () => {
      render(<BookshelfScreen />);

      expect(screen.getByText('테스트 책 1')).toBeTruthy();
      expect(screen.getByText('테스트 책 2')).toBeTruthy();
    });

    it('헤더에 "나의 서재" 타이틀이 표시된다', () => {
      render(<BookshelfScreen />);

      expect(screen.getByText('나의 서재')).toBeTruthy();
    });

    it('푸터에 책 수가 표시된다', () => {
      render(<BookshelfScreen />);

      expect(screen.getByText('2권의 수집된 이야기')).toBeTruthy();
    });

    it('책이 없으면 0권으로 표시된다', () => {
      mockFindAllReturn = {
        data: [],
        isLoading: false,
        error: null,
        refetch: mockRefetch,
      };

      render(<BookshelfScreen />);

      expect(screen.getByText('0권의 수집된 이야기')).toBeTruthy();
    });

    it('로딩 중이면 LoadingScreen을 표시한다', () => {
      mockFindAllReturn = {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: mockRefetch,
      };

      render(<BookshelfScreen />);

      expect(screen.getByText('로딩 중...')).toBeTruthy();
    });

    it('에러 발생 시 ErrorScreen을 표시한다', () => {
      mockFindAllReturn = {
        data: undefined,
        isLoading: false,
        error: new Error('Network Error'),
        refetch: mockRefetch,
      };

      render(<BookshelfScreen />);

      expect(screen.getByText('책 목록을 불러올 수 없습니다.')).toBeTruthy();
    });

    it('에러 상태에서 재시도 버튼을 누르면 refetch를 호출한다', () => {
      mockFindAllReturn = {
        data: undefined,
        isLoading: false,
        error: new Error('Network Error'),
        refetch: mockRefetch,
      };

      render(<BookshelfScreen />);

      fireEvent.press(screen.getByTestId('retry-button'));

      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  // ===== Create (추가) =====

  describe('책 추가', () => {
    it('+ 버튼을 누르면 add-book 페이지로 이동한다', () => {
      render(<BookshelfScreen />);

      fireEvent.press(screen.getByTestId('add-book-button'));

      expect(router.push).toHaveBeenCalledWith('/(main)/(bookshelf)/add-book');
    });
  });

  // ===== Detail (상세 조회) =====

  describe('책 상세 보기', () => {
    it('책을 누르면 상세 페이지로 이동한다', () => {
      render(<BookshelfScreen />);

      fireEvent.press(screen.getByTestId('book-1'));

      expect(router.push).toHaveBeenCalledWith('/(main)/(bookshelf)/book/1');
    });
  });

  // ===== Delete (삭제) =====

  describe('책 삭제', () => {
    it('책을 길게 누르면 삭제 확인 다이얼로그가 표시된다', () => {
      render(<BookshelfScreen />);

      fireEvent(screen.getByTestId('book-1'), 'longPress');

      expect(screen.getByTestId('confirm-dialog')).toBeTruthy();
      expect(screen.getByText('"테스트 책 1"을(를) 삭제하시겠습니까?')).toBeTruthy();
    });

    it('삭제 확인 시 mutateAsync를 호출하고 성공 스낵바를 표시한다', async () => {
      mockDeleteMutateAsync.mockResolvedValueOnce(undefined);
      mockInvalidateQueries.mockResolvedValueOnce(undefined);

      render(<BookshelfScreen />);

      fireEvent(screen.getByTestId('book-1'), 'longPress');
      fireEvent.press(screen.getByTestId('confirm-delete-button'));

      await waitFor(() => {
        expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ id: 1 });
      });

      await waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['/books'],
        });
      });

      await waitFor(() => {
        expect(screen.getByText('책이 삭제되었습니다.')).toBeTruthy();
      });
    });

    it('삭제 실패 시 실패 스낵바를 표시한다', async () => {
      mockDeleteMutateAsync.mockRejectedValueOnce(new Error('Delete failed'));

      render(<BookshelfScreen />);

      fireEvent(screen.getByTestId('book-2'), 'longPress');
      fireEvent.press(screen.getByTestId('confirm-delete-button'));

      await waitFor(() => {
        expect(mockDeleteMutateAsync).toHaveBeenCalledWith({ id: 2 });
      });

      await waitFor(() => {
        expect(screen.getByText('삭제에 실패했습니다.')).toBeTruthy();
      });
    });

    it('삭제 취소 시 다이얼로그가 닫힌다', () => {
      render(<BookshelfScreen />);

      fireEvent(screen.getByTestId('book-1'), 'longPress');
      expect(screen.getByTestId('confirm-dialog')).toBeTruthy();

      fireEvent.press(screen.getByTestId('dismiss-delete-button'));

      expect(screen.queryByTestId('confirm-dialog')).toBeNull();
    });
  });

});
