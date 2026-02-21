import { useEffect } from 'react';

let onForceLogout: (() => void) | null = null;

export function forceLogout() {
  onForceLogout?.();
}

export function useForceLogout(logout: () => Promise<void>) {
  useEffect(() => {
    onForceLogout = () => logout();
    return () => {
      onForceLogout = null;
    };
  }, [logout]);
}
