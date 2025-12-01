import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        // Check if response has a data property (API wrapper)
        if (event.body && typeof event.body === 'object' && 'data' in event.body) {
          // Return unwrapped data
          return event.clone({ body: event.body.data });
        }
      }
      return event;
    })
  );
};
