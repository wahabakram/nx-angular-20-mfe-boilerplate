import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User, UserRole } from '../models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userRole: computed(() => store.user()?.role ?? null),

    isAdmin: computed(() => store.user()?.role === 'admin'),

    isManager: computed(() => store.user()?.role === 'manager'),

    isCashier: computed(() => store.user()?.role === 'cashier'),

    hasRole: computed(() => (role: UserRole) => store.user()?.role === role),

    canManageInventory: computed(() => {
      const role = store.user()?.role;
      return role === 'admin' || role === 'manager';
    }),

    canManageUsers: computed(() => store.user()?.role === 'admin'),

    canManageBranches: computed(() => store.user()?.role === 'admin'),

    userFullName: computed(() => {
      const user = store.user();
      return user ? `${user.firstName} ${user.lastName}` : '';
    }),
  })),
  withMethods((store) => ({
    login(user: User, token: string): void {
      patchState(store, {
        user,
        token,
        isAuthenticated: true,
        error: null,
      });
      // Persist token to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout(): void {
      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedBranchId');
    },

    loadAuthFromStorage(): void {
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          patchState(store, {
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Invalid JSON, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    },

    updateUser(user: User): void {
      patchState(store, { user });
      localStorage.setItem('user', JSON.stringify(user));
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
