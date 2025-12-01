export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  photo?: Photo | null;
}

export interface Photo {
  id: string;
  path: string;
}

export type UserRole = {
  id: number;
  name: string;
};

export type UserStatus = {
  id: number;
  name: string;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse extends LoginResponse {}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  hash: string;
  password: string;
}

export interface VerifyEmailRequest {
  hash: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}
