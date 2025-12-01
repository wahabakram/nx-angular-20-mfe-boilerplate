import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { AuthStore } from '@invoicely/domain/user/store';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenResponse,
} from '@invoicely/domain/user/models';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends BaseApiService {
  private authStore = inject(AuthStore);

  login(data: LoginRequest): Observable<LoginResponse> {
    this.authStore.setLoading(true);
    return this.post<LoginResponse>('/auth/email/login', data).pipe(
      tap((response) => {
        this.authStore.setAuthData(
          response.user,
          response.token,
          response.refreshToken
        );
        this.authStore.setLoading(false);
      }),
      tap({
        error: () => this.authStore.setLoading(false),
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    this.authStore.setLoading(true);
    return this.post<RegisterResponse>('/auth/email/register', data).pipe(
      tap((response) => {
        this.authStore.setAuthData(
          response.user,
          response.token,
          response.refreshToken
        );
        this.authStore.setLoading(false);
      }),
      tap({
        error: () => this.authStore.setLoading(false),
      })
    );
  }

  logout(): Observable<void> {
    return this.post<void>('/auth/logout', {}).pipe(
      tap(() => this.authStore.logout())
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.authStore.refreshToken();
    return this.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    }).pipe(
      tap((response) => {
        this.authStore.setToken(response.token);
        this.authStore.setRefreshToken(response.refreshToken);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.get<User>('/auth/me').pipe(
      tap((user) => this.authStore.setUser(user))
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<void> {
    return this.post<void>('/auth/forgot/password', data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<void> {
    return this.post<void>('/auth/reset/password', data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<void> {
    return this.post<void>('/auth/email/confirm', data);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.patch<User>('/auth/me', data).pipe(
      tap((user) => this.authStore.updateUserProfile(user))
    );
  }
}
