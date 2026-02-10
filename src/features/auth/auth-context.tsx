import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User } from '@/types/models';
import { storage } from '@/lib/utils/storage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage
      .getUser<User>()
      .then((stored) => {
        if (stored) setUser(stored);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (u: User) => {
    await storage.setUser(u);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await storage.removeUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
