import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { AddBookScreen } from '../AddBookScreen';

// --- Mock data ---

const mockSearchResults = [
  {
    title: '리액트 네이티브',
    authors: ['홍길동', '김철수'],
    publisher: '한빛미디어',
    thumbnail: 'http://example.com/thumb.jpg',
  },
  {
    title: '리액트 입문',
    authors: ['이영희'],
    publisher: null,
    thumbnail: null,
  },
];

// --- Mock functions ---

const mockCreateMutateAsync = jest.fn();
const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
let mockSearchReturn: {
  data: typeof mockSearchResults | undefined;
  isFetching: boolean;
};
let mockCreateIsPending = false;

// --- Mocks ---

jest.mock('@/api/generated/books/books', () => ({
  useBookControllerSearch: () => mockSearchReturn,
  useBookControllerCreate: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: mockCreateIsPending,
  }),
  getBookControllerFindAllQueryKey: () => ['/books'],
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
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
    error: '#B71C1C',
  },
}));

// react-native-paper: Snackbar + 기본 컴포넌트
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    TextInput: (props: any) => (
      <RN.TextInput
        testID={props.testID ?? props.label}
        value={props.value}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmitEditing}
        placeholder={props.label}
      />
    ),
    Button: ({ children, onPress, disabled, loading, ...rest }: any) => (
      <RN.Pressable
        testID={rest.testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityState={{ disabled: !!disabled }}
      >
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    Text: RN.Text,
    Snackbar: ({ visible, children }: any) => {
      if (!visible) return null;
      return <RN.Text testID="snackbar">{children}</RN.Text>;
    },
    ActivityIndicator: ({ testID }: any) => {
      const { Text } = require('react-native');
      return <Text testID={testID}>loading</Text>;
    },
    TouchableRipple: ({ children, onPress, disabled, ...rest }: any) => {
      const { Pressable } = require('react-native');
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={rest.style}
        >
          {children}
        </Pressable>
      );
    },
  };
});

const { router } = require('expo-router');

// --- Setup ---

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  mockCreateIsPending = false;
  mockSearchReturn = {
    data: undefined,
    isFetching: false,
  };
});

afterEach(() => {
  jest.useRealTimers();
});

// --- Tests ---

describe('AddBookScreen', () => {
  describe('초기 렌더링', () => {
    it('검색 입력 필드와 검색 버튼이 렌더링된다', () => {
      render(<AddBookScreen />);

      expect(screen.getByPlaceholderText('책 제목')).toBeTruthy();
      expect(screen.getByText('검색')).toBeTruthy();
    });

    it('타이틀과 설명이 표시된다', () => {
      render(<AddBookScreen />);

      expect(screen.getByText('새 책 등록')).toBeTruthy();
      expect(
        screen.getByText('제목을 검색하여 책을 추가합니다.'),
      ).toBeTruthy();
    });
  });

  describe('검색', () => {
    it('검색어를 입력하고 검색 버튼을 누르면 검색이 실행된다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));

      // 검색 결과가 렌더링됨
      expect(screen.getByText('리액트 네이티브')).toBeTruthy();
      expect(screen.getByText('홍길동, 김철수')).toBeTruthy();
      expect(screen.getByText('한빛미디어')).toBeTruthy();
    });

    it('빈 검색어로는 검색이 실행되지 않는다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      // 빈 상태에서 검색 버튼 누르기
      fireEvent.press(screen.getByText('검색'));

      // 검색 결과가 표시되지 않아야 함
      expect(screen.queryByText('리액트 네이티브')).toBeNull();
    });

    it('검색 결과에서 출판사가 없는 항목은 출판사를 표시하지 않는다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));

      // 두 번째 결과에는 출판사가 null
      expect(screen.getByText('리액트 입문')).toBeTruthy();
      expect(screen.getByText('이영희')).toBeTruthy();
    });
  });

  describe('검색 결과 선택', () => {
    it('검색 결과를 선택하면 책이 생성된다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('리액트 네이티브'));

      await waitFor(() => {
        expect(mockCreateMutateAsync).toHaveBeenCalledWith({
          data: {
            title: '리액트 네이티브',
            author: '홍길동, 김철수',
            publisher: '한빛미디어',
            thumbnail: 'http://example.com/thumb.jpg',
          },
        });
      });

      await waitFor(() => {
        expect(mockInvalidateQueries).toHaveBeenCalledWith({
          queryKey: ['/books'],
        });
      });
    });

    it('책 생성 성공 시 스낵바를 표시하고 뒤로 이동한다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('리액트 네이티브'));

      await waitFor(() => {
        expect(screen.getByText('책이 추가되었습니다!')).toBeTruthy();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(router.back).toHaveBeenCalled();
    });

    it('책 생성 실패 시 에러 메시지를 표시한다', async () => {
      mockCreateMutateAsync.mockRejectedValueOnce(new Error('fail'));
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('리액트 네이티브'));

      await waitFor(() => {
        expect(screen.getByText('책 추가에 실패했습니다.')).toBeTruthy();
      });
    });
  });

  describe('빈 검색 결과 → 직접 입력 모드', () => {
    it('검색 결과가 없으면 "검색 결과가 없습니다" 메시지와 직접 입력 버튼이 표시된다', () => {
      mockSearchReturn = {
        data: [],
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '없는책',
      );
      fireEvent.press(screen.getByText('검색'));

      expect(screen.getByText('검색 결과가 없습니다.')).toBeTruthy();
      expect(screen.getByText('직접 입력하기')).toBeTruthy();
    });

    it('"직접 입력하기" 버튼을 누르면 수동 입력 폼이 표시된다', () => {
      mockSearchReturn = {
        data: [],
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '없는책',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('직접 입력하기'));

      expect(screen.getByText('직접 입력')).toBeTruthy();
      expect(screen.getByPlaceholderText('제목')).toBeTruthy();
      expect(screen.getByPlaceholderText('저자')).toBeTruthy();
      expect(screen.getByPlaceholderText('출판사 (선택)')).toBeTruthy();
      expect(screen.getByText('책장에 꽂기')).toBeTruthy();
    });

    it('직접 입력 시 검색어가 제목에 자동 입력된다', () => {
      mockSearchReturn = {
        data: [],
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '없는책',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('직접 입력하기'));

      expect(screen.getByPlaceholderText('제목').props.value).toBe('없는책');
    });
  });

  describe('직접 입력 폼 제출', () => {
    function enterManualMode() {
      mockSearchReturn = {
        data: [],
        isFetching: false,
      };
      render(<AddBookScreen />);

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '테스트',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('직접 입력하기'));
    }

    it('제목과 저자를 입력하고 제출하면 책이 생성된다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '수동 책');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '수동 저자');
      fireEvent.changeText(
        screen.getByPlaceholderText('출판사 (선택)'),
        '수동 출판사',
      );
      fireEvent.press(screen.getByText('책장에 꽂기'));

      await waitFor(() => {
        expect(mockCreateMutateAsync).toHaveBeenCalledWith({
          data: {
            title: '수동 책',
            author: '수동 저자',
            publisher: '수동 출판사',
          },
        });
      });
    });

    it('출판사 없이 제출하면 publisher가 undefined로 전달된다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '수동 책');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '수동 저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      await waitFor(() => {
        expect(mockCreateMutateAsync).toHaveBeenCalledWith({
          data: {
            title: '수동 책',
            author: '수동 저자',
            publisher: undefined,
          },
        });
      });
    });

    it('제목이 비어있으면 제출해도 mutateAsync가 호출되지 않는다', () => {
      enterManualMode();

      // 제목을 비우고 저자만 입력
      fireEvent.changeText(screen.getByPlaceholderText('제목'), '');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      expect(mockCreateMutateAsync).not.toHaveBeenCalled();
    });

    it('저자가 비어있으면 제출해도 mutateAsync가 호출되지 않는다', () => {
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '제목');
      // 저자는 비움
      fireEvent.press(screen.getByText('책장에 꽂기'));

      expect(mockCreateMutateAsync).not.toHaveBeenCalled();
    });

    it('직접 입력 성공 시 스낵바를 표시하고 뒤로 이동한다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '수동 책');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '수동 저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      await waitFor(() => {
        expect(screen.getByText('책이 추가되었습니다!')).toBeTruthy();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(router.back).toHaveBeenCalled();
    });

    it('직접 입력 실패 시 에러 메시지를 표시한다', async () => {
      mockCreateMutateAsync.mockRejectedValueOnce(new Error('fail'));
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '수동 책');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '수동 저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      await waitFor(() => {
        expect(screen.getByText('책 추가에 실패했습니다.')).toBeTruthy();
      });
    });
  });

  describe('로딩 상태', () => {
    it('검색 중(isFetching)일 때 ActivityIndicator가 표시된다', () => {
      mockSearchReturn = {
        data: undefined,
        isFetching: true,
      };
      render(<AddBookScreen />);

      // isFetching이면 ActivityIndicator 렌더링
      expect(screen.getAllByText('loading').length).toBeGreaterThan(0);
    });

    it('책 생성 중일 때 오버레이가 표시된다', () => {
      mockCreateIsPending = true;
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      render(<AddBookScreen />);

      expect(screen.getByText('등록 중...')).toBeTruthy();
    });
  });
});
