import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Only retry GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Don't retry on client errors (4xx) except 408 (timeout)
        if (error.status >= 400 && error.status < 500 && error.status !== 408) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, retryCount - 1) * 1000;
        console.log(`Retrying request (attempt ${retryCount}) after ${delayMs}ms`);
        return timer(delayMs);
      },
    })
  );
};
