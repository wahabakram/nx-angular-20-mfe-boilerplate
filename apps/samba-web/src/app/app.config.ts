import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import {
  API_CONFIG,
  offlineInterceptor
} from '@samba/infrastructure';
import { authInterceptor, AuthStore } from '@samba/user-domain';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, offlineInterceptor])
    ),
    {
      provide: API_CONFIG,
      useValue: { apiUrl: environment.apiUrl }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.loadAuthFromStorage();
    }),
  ],
};
