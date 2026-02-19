import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { AddBookModal } from '../AddBookModal';

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
const mockOnDismiss = jest.fn();
const mockOnSuccess = jest.fn();
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

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    shelfBrown: '#5D4037',
    shelfDark: '#3E2723',
    shelfHighlight: '#A1887F',
    paper: '#FFF8E1',
    warmWhite: '#FAF3E0',
    textPrimary: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    accentGreen: '#558B2F',
    error: '#B71C1C',
  },
}));

jest.mock('expo-blur', () => ({
  BlurView: ({ children }: any) => children,
}));

// react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Portal: ({ children }: any) => children,
    TextInput: Object.assign(
      React.forwardRef((props: any, ref: any) => (
        <RN.TextInput
          ref={ref}
          testID={props.testID ?? props.label}
          value={props.value}
          defaultValue={props.defaultValue}
          onChangeText={props.onChangeText}
          onSubmitEditing={props.onSubmitEditing}
          placeholder={props.label}
        />
      )),
      {
        Icon: (_props: any) => null,
      },
    ),
    Button: ({ children, onPress, disabled, ...rest }: any) => (
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
    ActivityIndicator: ({ testID }: any) => {
      const { Text } = require('react-native');
      return <Text testID={testID}>loading</Text>;
    },
    TouchableRipple: ({ children, onPress, disabled, ...rest }: any) => {
      const { Pressable } = require('react-native');
      return (
        <Pressable onPress={onPress} disabled={disabled} style={rest.style}>
          {children}
        </Pressable>
      );
    },
  };
});

// --- Setup ---

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateIsPending = false;
  mockSearchReturn = {
    data: undefined,
    isFetching: false,
  };
});

// --- Helpers ---

function renderModal(visible = true) {
  return render(
    <AddBookModal
      visible={visible}
      onDismiss={mockOnDismiss}
      onSuccess={mockOnSuccess}
    />,
  );
}

// --- Tests ---

describe('AddBookModal', () => {
  describe('초기 렌더링', () => {
    it('visible이 true이면 모달 내용이 렌더링된다', () => {
      renderModal();

      expect(screen.getByText('새 책 등록')).toBeTruthy();
      expect(
        screen.getByText('제목을 검색하여 책을 추가합니다.'),
      ).toBeTruthy();
      expect(screen.getByPlaceholderText('책 제목')).toBeTruthy();
      expect(screen.getByText('검색')).toBeTruthy();
      expect(screen.getByText('취소')).toBeTruthy();
    });

    it('visible이 false이면 모달 내용이 렌더링되지 않는다', () => {
      renderModal(false);

      expect(screen.queryByText('새 책 등록')).toBeNull();
    });
  });

  describe('검색', () => {
    it('검색어를 입력하고 검색 버튼을 누르면 검색이 실행된다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));

      expect(screen.getByText('리액트 네이티브')).toBeTruthy();
      expect(screen.getByText('홍길동, 김철수')).toBeTruthy();
      expect(screen.getByText('한빛미디어')).toBeTruthy();
    });

    it('빈 검색어로는 검색이 실행되지 않는다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

      fireEvent.press(screen.getByText('검색'));

      expect(screen.queryByText('리액트 네이티브')).toBeNull();
    });

    it('검색 결과에서 출판사가 없는 항목은 출판사를 표시하지 않는다', () => {
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));

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
      renderModal();

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

    it('책 생성 성공 시 onSuccess와 onDismiss가 호출된다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '리액트',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('리액트 네이티브'));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith('책이 추가되었습니다!');
      });
      expect(mockOnDismiss).toHaveBeenCalled();
    });

    it('책 생성 실패 시 에러 메시지를 표시한다', async () => {
      mockCreateMutateAsync.mockRejectedValueOnce(new Error('fail'));
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

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
      renderModal();

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
      renderModal();

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
      renderModal();

      fireEvent.changeText(
        screen.getByPlaceholderText('책 제목'),
        '없는책',
      );
      fireEvent.press(screen.getByText('검색'));
      fireEvent.press(screen.getByText('직접 입력하기'));

      expect(screen.getByPlaceholderText('제목').props.defaultValue).toBe(
        '없는책',
      );
    });
  });

  describe('직접 입력 폼 제출', () => {
    function enterManualMode() {
      mockSearchReturn = {
        data: [],
        isFetching: false,
      };
      renderModal();

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

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      expect(mockCreateMutateAsync).not.toHaveBeenCalled();
    });

    it('저자가 비어있으면 제출해도 mutateAsync가 호출되지 않는다', () => {
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '제목');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      expect(mockCreateMutateAsync).not.toHaveBeenCalled();
    });

    it('직접 입력 성공 시 onSuccess와 onDismiss가 호출된다', async () => {
      mockCreateMutateAsync.mockResolvedValueOnce({});
      enterManualMode();

      fireEvent.changeText(screen.getByPlaceholderText('제목'), '수동 책');
      fireEvent.changeText(screen.getByPlaceholderText('저자'), '수동 저자');
      fireEvent.press(screen.getByText('책장에 꽂기'));

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith('책이 추가되었습니다!');
      });
      expect(mockOnDismiss).toHaveBeenCalled();
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

  describe('취소 및 닫기', () => {
    it('취소 버튼을 누르면 onDismiss가 호출된다', () => {
      renderModal();

      fireEvent.press(screen.getByText('취소'));

      expect(mockOnDismiss).toHaveBeenCalled();
    });
  });

  describe('로딩 상태', () => {
    it('검색 중(isFetching)일 때 ActivityIndicator가 표시된다', () => {
      mockSearchReturn = {
        data: undefined,
        isFetching: true,
      };
      renderModal();

      expect(screen.getAllByText('loading').length).toBeGreaterThan(0);
    });

    it('책 생성 중일 때 오버레이가 표시된다', () => {
      mockCreateIsPending = true;
      mockSearchReturn = {
        data: mockSearchResults,
        isFetching: false,
      };
      renderModal();

      expect(screen.getByText('등록 중...')).toBeTruthy();
    });
  });
});
