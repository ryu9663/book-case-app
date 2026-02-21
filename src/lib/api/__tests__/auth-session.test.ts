import { renderHook } from '@testing-library/react-native';
import { forceLogout, useForceLogout } from '../auth-session';

describe('auth-session', () => {
  afterEach(() => {
    // 각 테스트 후 콜백 정리를 위해 unmount
  });

  describe('forceLogout', () => {
    it('콜백이 등록되지 않으면 아무 일도 일어나지 않는다', () => {
      expect(() => forceLogout()).not.toThrow();
    });

    it('등록된 콜백을 호출한다', () => {
      const logout = jest.fn().mockResolvedValue(undefined);
      const { unmount } = renderHook(() => useForceLogout(logout));

      forceLogout();

      expect(logout).toHaveBeenCalledTimes(1);
      unmount();
    });
  });

  describe('useForceLogout', () => {
    it('unmount 시 콜백이 해제된다', () => {
      const logout = jest.fn().mockResolvedValue(undefined);
      const { unmount } = renderHook(() => useForceLogout(logout));

      unmount();
      forceLogout();

      expect(logout).not.toHaveBeenCalled();
    });

    it('logout 함수가 변경되면 새 콜백으로 교체된다', () => {
      const logout1 = jest.fn().mockResolvedValue(undefined);
      const logout2 = jest.fn().mockResolvedValue(undefined);

      const { rerender, unmount } = renderHook(
        ({ logout }) => useForceLogout(logout),
        { initialProps: { logout: logout1 } },
      );

      rerender({ logout: logout2 });
      forceLogout();

      expect(logout1).not.toHaveBeenCalled();
      expect(logout2).toHaveBeenCalledTimes(1);
      unmount();
    });
  });
});
