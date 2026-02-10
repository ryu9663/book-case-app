export interface CreateUserDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CreateBookDto {
  isbn: string;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
}

export interface CreateReviewDto {
  title: string;
  content: string;
}

export interface UpdateReviewDto {
  title?: string;
  content?: string;
}
