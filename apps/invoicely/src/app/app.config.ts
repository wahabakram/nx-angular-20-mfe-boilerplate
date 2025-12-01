import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
import { appRoutes } from './app.routes';
import {
  authInterceptor,
  errorInterceptor,
  loadingInterceptor,
  apiResponseInterceptor,
  retryInterceptor,
} from './_infrastructure/interceptors';
import { AuthStore } from './_domain/user/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
        apiResponseInterceptor,
        retryInterceptor,
      ])
    ),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      // Initialize auth state from localStorage
      authStore.initializeFromStorage();
    }),
  ],
};
