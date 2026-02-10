import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { Book } from '@/types/models';
import type { CreateBookDto, UpdateBookDto } from '@/types/api';

// ----- Query keys -----
export const bookKeys = {
  all: ['books'] as const,
  detail: (id: number) => ['books', id] as const,
};

// ----- Raw API -----
async function fetchBooks(): Promise<Book[]> {
  const { data } = await apiClient.get<Book[]>(endpoints.books);
  return data;
}

async function fetchBook(id: number): Promise<Book> {
  const { data } = await apiClient.get<Book>(endpoints.book(id));
  return data;
}

async function createBook(dto: CreateBookDto): Promise<Book> {
  const { data } = await apiClient.post<Book>(endpoints.books, dto);
  return data;
}

async function updateBook(id: number, dto: UpdateBookDto): Promise<Book> {
  const { data } = await apiClient.patch<Book>(endpoints.book(id), dto);
  return data;
}

async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(endpoints.book(id));
}

// ----- Hooks -----
export function useBooks() {
  return useQuery({
    queryKey: bookKeys.all,
    queryFn: fetchBooks,
  });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: bookKeys.all }),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateBookDto }) =>
      updateBook(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: bookKeys.all });
      qc.invalidateQueries({ queryKey: bookKeys.detail(id) });
    },
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => qc.invalidateQueries({ queryKey: bookKeys.all }),
  });
}
