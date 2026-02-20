import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react-native';
import { EditBookModal } from '../EditBookModal';
import type { BookResponseDto } from '@/api/generated/models';

// --- Mock data ---

const mockBook: BookResponseDto = {
  id: 1,
  title: '리액트 네이티브',
  author: '홍길동',
  publisher: '한빛미디어',
  thumbnail: 'http://example.com/thumb.jpg',
  userId: 1,
};

// --- Mock functions ---

const mockOnSave = jest.fn();
const mockOnDismiss = jest.fn();

// --- Mocks ---

jest.mock('expo-blur', () => ({
  BlurView: ({ children }: any) => children,
}));

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
          defaultValue={props.defaultValue}
          onChangeText={props.onChangeText}
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
  };
});

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
  },
}));

// --- Setup ---

beforeEach(() => {
  jest.clearAllMocks();
});

// --- Helpers ---

function renderModal(
  overrides: Partial<React.ComponentProps<typeof EditBookModal>> = {},
) {
  return render(
    <EditBookModal
      visible={true}
      book={mockBook}
      onSave={mockOnSave}
      onDismiss={mockOnDismiss}
      {...overrides}
    />,
  );
}

// --- Tests ---

describe('EditBookModal', () => {
  describe('렌더링', () => {
    it('visible이 false이면 아무것도 렌더링하지 않는다', () => {
      renderModal({ visible: false });

      expect(screen.queryByText('책 정보 수정')).toBeNull();
    });

    it('visible이 true이면 모달 내용이 렌더링된다', () => {
      renderModal();

      expect(screen.getByText('책 정보 수정')).toBeTruthy();
      expect(screen.getByTestId('edit-title')).toBeTruthy();
      expect(screen.getByTestId('edit-author')).toBeTruthy();
      expect(screen.getByText('저장')).toBeTruthy();
      expect(screen.getByText('취소')).toBeTruthy();
    });
  });

  describe('기존 데이터 복원', () => {
    it('book prop이 전달되면 defaultValue에 반영된다', () => {
      renderModal();

      expect(screen.getByTestId('edit-title').props.defaultValue).toBe(
        '리액트 네이티브',
      );
      expect(screen.getByTestId('edit-author').props.defaultValue).toBe(
        '홍길동',
      );
    });

    it('book이 null이면 빈 defaultValue로 렌더링된다', () => {
      renderModal({ book: null });

      expect(screen.getByTestId('edit-title').props.defaultValue).toBe('');
      expect(screen.getByTestId('edit-author').props.defaultValue).toBe('');
    });
  });

  describe('저장', () => {
    it('제목과 저자를 입력하고 저장하면 onSave가 호출된다', () => {
      renderModal();

      fireEvent.changeText(screen.getByTestId('edit-title'), '수정된 제목');
      fireEvent.changeText(screen.getByTestId('edit-author'), '수정된 저자');
      fireEvent.press(screen.getByText('저장'));

      expect(mockOnSave).toHaveBeenCalledWith('수정된 제목', '수정된 저자');
    });

    it('제목이 비어있으면 onSave가 호출되지 않는다', () => {
      renderModal();

      fireEvent.changeText(screen.getByTestId('edit-title'), '   ');
      fireEvent.press(screen.getByText('저장'));

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('변경 없이 저장하면 기존 값으로 onSave가 호출된다', () => {
      renderModal();

      fireEvent.press(screen.getByText('저장'));

      expect(mockOnSave).toHaveBeenCalledWith('리액트 네이티브', '홍길동');
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
    it('isLoading이 true이면 저장 버튼을 눌러도 onSave가 호출되지 않는다', () => {
      renderModal({ isLoading: true });

      fireEvent.press(screen.getByText('저장'));

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });
});
