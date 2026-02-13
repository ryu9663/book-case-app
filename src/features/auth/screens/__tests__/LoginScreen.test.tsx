import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { LoginScreen } from '../LoginScreen';

// --- Mocks ---

const mockMutateAsync = jest.fn();
let mockIsPending = false;

jest.mock('@/api/generated/auth/auth', () => ({
  useAuthControllerLogin: () => ({
    mutateAsync: mockMutateAsync,
    isPending: mockIsPending,
  }),
}));

const mockLogin = jest.fn();
jest.mock('../../auth-context', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('@/lib/theme/colors', () => ({
  colors: {
    textPrimary: '#000',
    textSecondary: '#666',
    textMuted: '#999',
    shelfDark: '#3E2723',
    shelfBrown: '#5D4037',
  },
}));

jest.spyOn(Alert, 'alert');

beforeEach(() => {
  jest.clearAllMocks();
  mockIsPending = false;
});

// --- Tests ---

describe('LoginScreen', () => {
  it('이메일/비밀번호 입력, 로그인 버튼, 회원가입 링크가 렌더링된다', () => {
    render(<LoginScreen />);

    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByText('서재 들어가기')).toBeTruthy();
    expect(screen.getByText(/회원가입/)).toBeTruthy();
  });

  it('이메일/비밀번호가 비어있으면 mutateAsync를 호출하지 않는다', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByText('서재 들어가기'));

    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('로그인 성공 시 mutateAsync와 login을 호출한다', async () => {
    const tokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
    mockMutateAsync.mockResolvedValueOnce(tokens);

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId('email-input'), 'test@test.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'password123');
    fireEvent.press(screen.getByText('서재 들어가기'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        data: { email: 'test@test.com', password: 'password123' },
      });
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(tokens);
    });
  });

  it('401 에러 시 "로그인 실패" Alert를 표시한다', async () => {
    const error = new axios.AxiosError('Unauthorized', '401', undefined, undefined, {
      status: 401,
      data: { message: '이메일 또는 비밀번호가 올바르지 않습니다' },
      statusText: 'Unauthorized',
      headers: {},
      config: {} as any,
    });
    mockMutateAsync.mockRejectedValueOnce(error);

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId('email-input'), 'test@test.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'wrong');
    fireEvent.press(screen.getByText('서재 들어가기'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '로그인 실패',
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    });
  });

  it('네트워크 에러 시 "네트워크 오류" Alert를 표시한다', async () => {
    mockMutateAsync.mockRejectedValueOnce(new Error('Network Error'));

    render(<LoginScreen />);

    fireEvent.changeText(screen.getByTestId('email-input'), 'test@test.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'password123');
    fireEvent.press(screen.getByText('서재 들어가기'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '네트워크 오류',
        '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
      );
    });
  });

  it('isPending이 true이면 버튼이 disabled된다', () => {
    mockIsPending = true;

    render(<LoginScreen />);

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('회원가입 텍스트를 누르면 register 화면으로 이동한다', () => {
    render(<LoginScreen />);

    fireEvent.press(screen.getByRole('link'));

    expect(router.push).toHaveBeenCalledWith('/(auth)/register');
  });
});
