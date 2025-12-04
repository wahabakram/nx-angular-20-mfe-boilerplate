import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { AuthResponse, LoginCredentials, User } from '../models/user.model';
import { AuthStore } from '../store/auth.store';
import { BranchStore } from '@samba/branch-domain';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private authStore = inject(AuthStore);
  private branchStore = inject(BranchStore);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        // Store auth data
        this.authStore.login(response.user, response.token);

        // Set user's branch as selected branch
        this.branchStore.selectBranch(response.user.branchId);
      })
    );
  }

  logout(): void {
    this.authStore.logout();
    // Optionally call API to invalidate token
    // this.apiService.post('/auth/logout', {}).subscribe();
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response) => {
        this.authStore.login(response.user, response.token);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/auth/me').pipe(
      tap((user) => {
        this.authStore.updateUser(user);
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.apiService.post<void>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  initializeAuth(): void {
    // Load auth from localStorage on app init
    this.authStore.loadAuthFromStorage();

    // If authenticated, load user's branch selection
    if (this.authStore.isAuthenticated()) {
      this.branchStore.loadSelectedBranchFromStorage();

      // Optionally verify token is still valid
      this.getCurrentUser().subscribe({
        error: () => {
          // Token invalid, logout
          this.logout();
        },
      });
    }
  }
}
