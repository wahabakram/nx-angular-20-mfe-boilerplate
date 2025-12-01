import { computed, inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';
import { patchState } from '@ngrx/signals';
import { User } from '../models/user.model';
import { StorageService } from '@invoicely/infrastructure/utils';
import { environment } from '../../../../environments/environment';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userFullName: computed(() => {
      const user = store.user();
      if (!user) return '';
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      return `${firstName} ${lastName}`.trim() || user.email;
    }),
    isAdmin: computed(() => {
      const user = store.user();
      return user?.role?.name === 'admin';
    }),
    userInitials: computed(() => {
      const user = store.user();
      if (!user) return '';
      const firstName = user.firstName?.[0] || '';
      const lastName = user.lastName?.[0] || '';
      return `${firstName}${lastName}`.toUpperCase() || user.email[0].toUpperCase();
    }),
  })),
  withMethods((store) => {
    const storage = inject(StorageService);

    return {
      setUser(user: User | null): void {
        patchState(store, { user, isAuthenticated: !!user });
        if (user) {
          storage.setItem(environment.userKey, user);
        } else {
          storage.removeItem(environment.userKey);
        }
      },

      setToken(token: string | null): void {
        patchState(store, { token });
        if (token) {
          storage.setItem(environment.tokenKey, token);
        } else {
          storage.removeItem(environment.tokenKey);
        }
      },

      setRefreshToken(refreshToken: string | null): void {
        patchState(store, { refreshToken });
        if (refreshToken) {
          storage.setItem(environment.refreshTokenKey, refreshToken);
        } else {
          storage.removeItem(environment.refreshTokenKey);
        }
      },

      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      setAuthData(user: User, token: string, refreshToken: string): void {
        patchState(store, {
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
        storage.setItem(environment.userKey, user);
        storage.setItem(environment.tokenKey, token);
        storage.setItem(environment.refreshTokenKey, refreshToken);
      },

      logout(): void {
        patchState(store, initialState);
        storage.removeItem(environment.userKey);
        storage.removeItem(environment.tokenKey);
        storage.removeItem(environment.refreshTokenKey);
      },

      initializeFromStorage(): void {
        const token = storage.getItem<string>(environment.tokenKey);
        const refreshToken = storage.getItem<string>(environment.refreshTokenKey);
        const user = storage.getItem<User>(environment.userKey);

        if (token && user) {
          patchState(store, {
            token,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        }
      },

      updateUserProfile(updates: Partial<User>): void {
        const currentUser = store.user();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          patchState(store, { user: updatedUser });
          storage.setItem(environment.userKey, updatedUser);
        }
      },
    };
  })
);
