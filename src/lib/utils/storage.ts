import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: '@bookcase/user',
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

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
