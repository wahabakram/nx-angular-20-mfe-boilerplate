import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { GlobalStore } from '@ng-mf/components';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStore = inject(GlobalStore);

  // Increment active requests
  activeRequests++;
  globalStore.setScreenLoading(true);

  return next(req).pipe(
    finalize(() => {
      // Decrement active requests
      activeRequests--;

      // If no more active requests, hide loading
      if (activeRequests === 0) {
        globalStore.setScreenLoading(false);
      }
    })
  );
};
