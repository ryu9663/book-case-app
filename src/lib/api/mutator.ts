import Axios, { AxiosRequestConfig } from 'axios';
import { storage } from '@/lib/utils/storage';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: 'http://192.168.0.4:4000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

AXIOS_INSTANCE.interceptors.request.use(async (config) => {
  const token = await storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (Axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      return Promise.reject(new ApiError(status, message));
    }
    return Promise.reject(error);
  },
);

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
