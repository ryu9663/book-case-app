import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { User } from '@/types/models';
import type { CreateUserDto, LoginDto, AuthTokens } from '@/types/api';

export async function loginUser(dto: LoginDto): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>(endpoints.login, dto);
  return data;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const { data } = await apiClient.post<User>(endpoints.users, dto);
  return data;
}

export async function refreshToken(): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>(endpoints.refresh);
  return data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post(endpoints.logout);
}
