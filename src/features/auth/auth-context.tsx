import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@/types/models';
import type { AuthTokens } from '@/types/api';
import { storage } from '@/lib/utils/storage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<void>;
  loginWithUser: (user: User, tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function decodeJwtPayload(token: string): { sub: number; email: string } {
  const base64 = token.split('.')[1];
  const json = atob(base64);
  return JSON.parse(json);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedUser, accessToken] = await Promise.all([
          storage.getUser<User>(),
          storage.getAccessToken(),
        ]);
        if (storedUser && accessToken) {
          setUser(storedUser);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (tokens: AuthTokens) => {
    await storage.setTokens(tokens.accessToken, tokens.refreshToken);
    const payload = decodeJwtPayload(tokens.accessToken);
    const u: User = { id: payload.sub, email: payload.email };
    await storage.setUser(u);
    setUser(u);
  }, []);

  const loginWithUser = useCallback(
    async (u: User, tokens: AuthTokens) => {
      await storage.setTokens(tokens.accessToken, tokens.refreshToken);
      await storage.setUser(u);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(async () => {
    await storage.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
