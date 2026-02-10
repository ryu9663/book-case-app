import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@bookcase/user',
  ACCESS_TOKEN: '@bookcase/accessToken',
  REFRESH_TOKEN: '@bookcase/refreshToken',
} as const;

export const storage = {
  async getUser<T>(): Promise<T | null> {
    const raw = await AsyncStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  },

  async setUser<T>(user: T): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(KEYS.ACCESS_TOKEN, accessToken),
      AsyncStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  async clear(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.USER,
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
    ]);
  },
};
