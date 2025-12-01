import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@invoicely/domain/user/store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  // Skip adding token for auth endpoints
  const isAuthEndpoint =
    req.url.includes('/auth/') ||
    req.url.includes('/login') ||
    req.url.includes('/register');

  if (token && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
