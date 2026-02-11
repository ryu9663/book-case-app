import Axios, { AxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { storage } from '@/lib/utils/storage';

const REFRESH_URL = '/auth/refresh';

let refreshPromise: Promise<string | void> | null = null;

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'http://192.168.0.4:4000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  let token: string | null = null;
  if (config.url === '/auth/refresh') {
    token = await storage.getRefreshToken();
  } else {
    token = await storage.getAccessToken();
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    if (config && status) {
      if (
        config.url === REFRESH_URL ||
        status !== 401 ||
        config.sent === true
      ) {
        return Promise.reject(error);
      }
      config.sent = true;

      const newAccess = await getNewAccessToken();
      if (newAccess) {
        config.headers.Authorization = `Bearer ${newAccess}`;
        return AXIOS_INSTANCE(config);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

const getNewAccessToken = async (): Promise<string | void> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const {
        data: { accessToken, refreshToken },
      } = await AXIOS_INSTANCE.post('/auth/refresh');

      await storage.setTokens(accessToken, refreshToken);

      return accessToken;
    } catch {
      await storage.clear();
      Alert.alert('세션 만료', '다시 로그인해주세요.', [
        { text: '확인', onPress: () => router.replace('/(auth)/login') },
      ]);
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = AXIOS_INSTANCE(config).then(({ data }) => data);
  return promise;
};

export default customInstance;
