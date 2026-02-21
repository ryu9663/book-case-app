import { render, screen } from '@testing-library/react-native';

// --- Mocks ---

const mockReplace = jest.fn();
const mockDismissAll = jest.fn();
let mockCanDismiss = jest.fn(() => false);
let mockSegments: string[] = [];

jest.mock('expo-router', () => {
  const { View } = require('react-native');
  return {
    Stack: () => <View testID="stack" />,
    useRouter: () => ({
      replace: mockReplace,
      dismissAll: mockDismissAll,
      canDismiss: mockCanDismiss,
    }),
    useSegments: () => mockSegments,
  };
});

let mockUser: { id: number; email: string } | null = null;
let mockIsLoading = false;

jest.mock('@/features/auth/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: mockUser, isLoading: mockIsLoading }),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('@expo-google-fonts/gowun-dodum', () => ({
  GowunDodum_400Regular: 'GowunDodum_400Regular',
}));

jest.mock('react-native-paper-dates', () => ({
  registerTranslation: jest.fn(),
}));

jest.mock('react-native-paper-dates/src/translations/ko', () => ({}));

jest.mock('react-native-paper', () => ({
  PaperProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@/lib/theme', () => ({
  theme: {},
}));

jest.mock('@/components/ui/LoadingScreen', () => {
  const { View, Text } = require('react-native');
  return {
    LoadingScreen: () => (
      <View testID="loading-screen">
        <Text>Loading</Text>
      </View>
    ),
  };
});

import RootLayout from '../_layout';

beforeEach(() => {
  jest.clearAllMocks();
  mockUser = null;
  mockIsLoading = false;
  mockSegments = [];
  mockCanDismiss = jest.fn(() => false);
});

// --- Tests ---

describe('AuthGate', () => {
  it('로딩 중이면 LoadingScreen을 표시한다', () => {
    mockIsLoading = true;

    render(<RootLayout />);

    expect(screen.getByTestId('loading-screen')).toBeTruthy();
  });

  it('로딩 중이면 네비게이션을 호출하지 않는다', () => {
    mockIsLoading = true;

    render(<RootLayout />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockDismissAll).not.toHaveBeenCalled();
  });

  it('유저가 없고 auth 밖이면 로그인 화면으로 replace한다', () => {
    mockUser = null;
    mockSegments = ['(main)'];

    render(<RootLayout />);

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });

  it('유저가 없고 auth 밖이고 스택이 비어있으면 dismissAll을 호출하지 않는다', () => {
    mockUser = null;
    mockSegments = ['(main)'];
    mockCanDismiss = jest.fn(() => false);

    render(<RootLayout />);

    expect(mockCanDismiss).toHaveBeenCalled();
    expect(mockDismissAll).not.toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });

  it('유저가 없고 auth 밖이고 스택에 화면이 있으면 dismissAll 후 replace한다', () => {
    mockUser = null;
    mockSegments = ['(main)'];
    mockCanDismiss = jest.fn(() => true);

    render(<RootLayout />);

    expect(mockCanDismiss).toHaveBeenCalled();
    expect(mockDismissAll).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });

  it('유저가 있고 auth 안이면 메인 화면으로 replace한다', () => {
    mockUser = { id: 1, email: 'test@test.com' };
    mockSegments = ['(auth)'];

    render(<RootLayout />);

    expect(mockReplace).toHaveBeenCalledWith('/(main)');
    expect(mockDismissAll).not.toHaveBeenCalled();
  });

  it('유저가 있고 auth 밖이면 네비게이션을 호출하지 않는다', () => {
    mockUser = { id: 1, email: 'test@test.com' };
    mockSegments = ['(main)'];

    render(<RootLayout />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockDismissAll).not.toHaveBeenCalled();
  });

  it('유저가 없고 auth 안이면 네비게이션을 호출하지 않는다', () => {
    mockUser = null;
    mockSegments = ['(auth)'];

    render(<RootLayout />);

    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockDismissAll).not.toHaveBeenCalled();
  });
});
