import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { UserRole } from '../models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    const userRole = authStore.userRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
}
