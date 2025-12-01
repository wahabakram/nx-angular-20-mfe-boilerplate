import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '@invoicely/domain/user/store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            // Unauthorized - logout and redirect to login
            authStore.logout();
            router.navigate(['/auth/signin']);
            errorMessage = 'Session expired. Please login again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 422:
            // Validation errors
            if (error.error?.errors) {
              const validationErrors = error.error.errors;
              const firstError = Object.values(validationErrors)[0] as string[];
              errorMessage = firstError[0] || 'Validation error';
            } else {
              errorMessage = error.error?.message || 'Validation error';
            }
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage =
              error.error?.message || `Error: ${error.status} - ${error.statusText}`;
        }
      }

      // You can integrate with a notification service here
      console.error('HTTP Error:', errorMessage, error);

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        error: error.error,
      }));
    })
  );
};
