import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { ReviewFormScreen } from '../ReviewFormScreen';

// --- Mocks ---

const mockCreateMutateAsync = jest.fn();
const mockUpdateMutateAsync = jest.fn();
let mockCreateIsPending = false;
let mockUpdateIsPending = false;
let mockExistingReview: any = undefined;
let mockIsLoading = false;

jest.mock('@/api/generated/reviews/reviews', () => ({
  useReviewControllerCreate: () => ({
    mutateAsync: mockCreateMutateAsync,
    isPending: mockCreateIsPending,
  }),
  useReviewControllerUpdate: () => ({
    mutateAsync: mockUpdateMutateAsync,
    isPending: mockUpdateIsPending,
  }),
  useReviewControllerFindOne: () => ({
    data: mockExistingReview,
    isLoading: mockIsLoading,
  }),
  getReviewControllerFindAllQueryKey: (bookId: number) => [
    `/books/${bookId}/reviews`,
  ],
  getReviewControllerFindOneQueryKey: (bookId: number, id: number) => [
    `/books/${bookId}/reviews/${id}`,
  ],
}));

const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

let mockParams: Record<string, string | undefined> = { bookId: '1' };
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => mockParams,
}));

let mockDatePickerOnConfirm: ((params: any) => void) | null = null;
jest.mock('react-native-paper-dates', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    DatePickerModal: (props: any) => {
      mockDatePickerOnConfirm = props.onConfirm;
      if (!props.visible) return null;
      return (
        <View testID="date-picker-modal">
          <TouchableOpacity
            testID="date-picker-confirm"
            onPress={() =>
              props.onConfirm({
                startDate: new Date('2026-01-15T00:00:00'),
                endDate: new Date('2026-02-15T00:00:00'),
              })
            }
          >
            <Text>확인</Text>
          </TouchableOpacity>
        </View>
      );
    },
    registerTranslation: jest.fn(),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@/components/ui/LoadingScreen', () => ({
  LoadingScreen: () => {
    const { Text } = require('react-native');
    return <Text>LoadingScreen</Text>;
  },
}));

jest.mock('../../components/StickerSelector', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    StickerSelector: ({ selected, onSelect }: any) => (
      <View testID="sticker-selector">
        {['sparkle', 'plant', 'coffee', 'moon'].map((type: string) => (
          <TouchableOpacity
            key={type}
            testID={`sticker-${type}`}
            onPress={() => onSelect(type)}
          >
            <Text>{selected === type ? `[${type}]` : type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

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
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateIsPending = false;
  mockUpdateIsPending = false;
  mockExistingReview = undefined;
  mockIsLoading = false;
  mockParams = { bookId: '1' };
  mockDatePickerOnConfirm = null;
});

// --- Tests ---

describe('ReviewFormScreen', () => {
  it('모든 필드가 렌더링된다', () => {
    render(<ReviewFormScreen />);

    expect(screen.getByTestId('title-input')).toBeTruthy();
    expect(screen.getByTestId('sticker-selector')).toBeTruthy();
    expect(screen.getByTestId('content-input')).toBeTruthy();
    expect(screen.getByTestId('date-range-button')).toBeTruthy();
    expect(screen.getByTestId('start-page-input')).toBeTruthy();
    expect(screen.getByTestId('end-page-input')).toBeTruthy();
  });

  it('제목/내용 빈값이면 스낵바 에러를 표시한다', () => {
    render(<ReviewFormScreen />);

    fireEvent.press(screen.getByLabelText('독후감 작성'));

    expect(screen.getByText('제목과 내용을 입력해주세요.')).toBeTruthy();
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('스티커 미선택이면 스낵바 에러를 표시한다', () => {
    render(<ReviewFormScreen />);

    fireEvent.changeText(screen.getByTestId('title-input'), '테스트 제목');
    fireEvent.changeText(screen.getByTestId('content-input'), '테스트 내용');
    fireEvent.press(screen.getByLabelText('독후감 작성'));

    expect(screen.getByText('무드 스티커를 선택해주세요.')).toBeTruthy();
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('날짜 미선택이면 스낵바 에러를 표시한다', () => {
    render(<ReviewFormScreen />);

    fireEvent.changeText(screen.getByTestId('title-input'), '테스트 제목');
    fireEvent.changeText(screen.getByTestId('content-input'), '테스트 내용');
    fireEvent.press(screen.getByTestId('sticker-sparkle'));
    fireEvent.changeText(screen.getByTestId('start-page-input'), '1');
    fireEvent.changeText(screen.getByTestId('end-page-input'), '100');
    fireEvent.press(screen.getByLabelText('독후감 작성'));

    expect(screen.getByText('독서 기간을 선택해주세요.')).toBeTruthy();
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('startPage > endPage이면 스낵바 에러를 표시한다', () => {
    render(<ReviewFormScreen />);

    fireEvent.changeText(screen.getByTestId('title-input'), '테스트 제목');
    fireEvent.changeText(screen.getByTestId('content-input'), '테스트 내용');
    fireEvent.press(screen.getByTestId('sticker-sparkle'));
    // 날짜 선택
    fireEvent.press(screen.getByTestId('date-range-button'));
    fireEvent.press(screen.getByTestId('date-picker-confirm'));
    // 페이지: start > end
    fireEvent.changeText(screen.getByTestId('start-page-input'), '200');
    fireEvent.changeText(screen.getByTestId('end-page-input'), '100');
    fireEvent.press(screen.getByLabelText('독후감 작성'));

    expect(
      screen.getByText('시작 페이지가 끝 페이지보다 클 수 없습니다.'),
    ).toBeTruthy();
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('생성 모드: 7개 필드를 포함해서 mutateAsync를 호출한다', async () => {
    mockCreateMutateAsync.mockResolvedValueOnce({});
    render(<ReviewFormScreen />);

    fireEvent.changeText(screen.getByTestId('title-input'), '테스트 제목');
    fireEvent.changeText(screen.getByTestId('content-input'), '테스트 내용');
    fireEvent.press(screen.getByTestId('sticker-plant'));
    // 날짜 선택
    fireEvent.press(screen.getByTestId('date-range-button'));
    fireEvent.press(screen.getByTestId('date-picker-confirm'));
    // 페이지
    fireEvent.changeText(screen.getByTestId('start-page-input'), '1');
    fireEvent.changeText(screen.getByTestId('end-page-input'), '150');

    fireEvent.press(screen.getByLabelText('독후감 작성'));

    await waitFor(() => {
      expect(mockCreateMutateAsync).toHaveBeenCalledWith({
        bookId: 1,
        data: {
          title: '테스트 제목',
          content: '테스트 내용',
          startDate: '2026-01-15',
          endDate: '2026-02-15',
          startPage: 1,
          endPage: 150,
          sticker: 'plant',
        },
      });
    });
  });

  it('startDate > endDate이면 스낵바 에러를 표시한다', () => {
    render(<ReviewFormScreen />);

    fireEvent.changeText(screen.getByTestId('title-input'), '테스트 제목');
    fireEvent.changeText(screen.getByTestId('content-input'), '테스트 내용');
    fireEvent.press(screen.getByTestId('sticker-sparkle'));
    // 날짜 역순 선택: startDate > endDate
    fireEvent.press(screen.getByTestId('date-range-button'));
    mockDatePickerOnConfirm!({
      startDate: new Date('2026-02-15T00:00:00'),
      endDate: new Date('2026-01-15T00:00:00'),
    });
    // 페이지
    fireEvent.changeText(screen.getByTestId('start-page-input'), '1');
    fireEvent.changeText(screen.getByTestId('end-page-input'), '100');
    fireEvent.press(screen.getByLabelText('독후감 작성'));

    expect(
      screen.getByText('시작 날짜가 끝 날짜보다 클 수 없습니다.'),
    ).toBeTruthy();
    expect(mockCreateMutateAsync).not.toHaveBeenCalled();
  });

  it('수정 모드: 기존 데이터가 복원되고 수정된 데이터로 제출된다', async () => {
    mockParams = { bookId: '1', id: '10' };
    mockExistingReview = {
      id: 10,
      title: '기존 제목',
      content: '기존 내용',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      startPage: 10,
      endPage: 200,
      sticker: 'coffee',
    };
    mockUpdateMutateAsync.mockResolvedValueOnce({});

    render(<ReviewFormScreen />);

    // 기존 데이터 복원 확인 (uncontrolled: defaultValue로 검증)
    expect(screen.getByTestId('title-input').props.defaultValue).toBe(
      '기존 제목',
    );
    expect(screen.getByTestId('content-input').props.defaultValue).toBe(
      '기존 내용',
    );
    expect(screen.getByTestId('start-page-input').props.defaultValue).toBe(
      '10',
    );
    expect(screen.getByTestId('end-page-input').props.defaultValue).toBe(
      '200',
    );
    expect(screen.getByText('2026.01.01 ~ 2026.01.31')).toBeTruthy();
    // 스티커 복원 확인
    expect(screen.getByText('[coffee]')).toBeTruthy();

    // 제목만 수정 후 제출
    fireEvent.changeText(screen.getByTestId('title-input'), '수정된 제목');
    fireEvent.press(screen.getByLabelText('독후감 수정'));

    await waitFor(() => {
      expect(mockUpdateMutateAsync).toHaveBeenCalledWith({
        bookId: 1,
        id: 10,
        data: {
          title: '수정된 제목',
          content: '기존 내용',
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          startPage: 10,
          endPage: 200,
          sticker: 'coffee',
        },
      });
    });
  });

  it('수정 모드 로딩 시 LoadingScreen을 표시한다', () => {
    mockParams = { bookId: '1', id: '10' };
    mockIsLoading = true;

    render(<ReviewFormScreen />);

    expect(screen.getByText('LoadingScreen')).toBeTruthy();
  });
});
