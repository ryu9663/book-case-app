import { customInstance } from '@/lib/api/mutator';
import type { LoginDto, CreateUserDto, UserResponseDto } from '@/api/generated/models';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(dto: LoginDto): Promise<AuthTokens> {
  return customInstance<AuthTokens>({
    url: '/auth/login',
    method: 'POST',
    data: dto,
  });
}

export async function createUser(dto: CreateUserDto): Promise<UserResponseDto> {
  return customInstance<UserResponseDto>({
    url: '/users',
    method: 'POST',
    data: dto,
  });
}

export async function refreshToken(): Promise<AuthTokens> {
  return customInstance<AuthTokens>({
    url: '/auth/refresh',
    method: 'POST',
  });
}

export async function logoutUser(): Promise<void> {
  return customInstance<void>({
    url: '/auth/logout',
    method: 'POST',
  });
}
