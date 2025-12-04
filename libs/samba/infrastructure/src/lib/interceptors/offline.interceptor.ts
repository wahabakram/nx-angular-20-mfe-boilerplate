import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { OfflineService } from '../services/offline/offline.service';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineService = inject(OfflineService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!navigator.onLine || error.status === 0) {
        // Queue request for later sync (for POST, PUT, PATCH, DELETE)
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
          const localId = Date.now(); // Temporary local ID
          const entityType = extractEntityType(req.url);

          offlineService.queueRequest(req, entityType, localId, localId);

          return throwError(() => new Error('Application is offline. Request queued for sync.'));
        }

        return throwError(() => new Error('Application is offline. Cannot fetch data.'));
      }

      return throwError(() => error);
    })
  );
};

function extractEntityType(url: string): string {
  // Extract entity type from URL
  // Example: /api/products/123 -> product
  // Example: /api/sales -> sale
  const match = url.match(/\/([a-z-]+)/);
  if (match && match[1]) {
    const entity = match[1];
    // Singularize common plural forms
    if (entity.endsWith('ies')) {
      return entity.slice(0, -3) + 'y'; // categories -> category
    }
    if (entity.endsWith('s')) {
      return entity.slice(0, -1); // products -> product
    }
    return entity;
  }
  return 'unknown';
}
