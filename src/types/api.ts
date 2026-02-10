export interface CreateUserDto {
  email: string;
  password: string;
}

export interface CreateBookDto {
  isbn: string;
  userId: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
}

export interface CreateReviewDto {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
}
