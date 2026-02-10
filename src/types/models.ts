export interface User {
  id: number;
  email: string;
}

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  userId: number;
  user?: User;
}

export interface Review {
  id: number;
  title: string;
  content: string;
  bookId: number;
  userId: number;
  book?: Book;
  user?: User;
}
