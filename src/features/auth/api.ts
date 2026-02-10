import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { User } from '@/types/models';
import type { CreateUserDto } from '@/types/api';

export async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>(endpoints.users);
  return data;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  const { data } = await apiClient.post<User>(endpoints.users, dto);
  return data;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await fetchUsers();
  return users.find((u) => u.email === email) ?? null;
}
