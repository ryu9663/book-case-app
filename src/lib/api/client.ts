import axios from 'axios';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = axios.create({
  baseURL: 'http://192.168.0.4:4000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      return Promise.reject(new ApiError(status, message));
    }
    return Promise.reject(error);
  },
);
