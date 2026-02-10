export const endpoints = {
  users: '/users',
  user: (id: number) => `/users/${id}`,

  books: '/books',
  book: (id: number) => `/books/${id}`,

  bookReviews: (bookId: number) => `/books/${bookId}/reviews`,
  bookReview: (bookId: number, reviewId: number) =>
    `/books/${bookId}/reviews/${reviewId}`,
} as const;
