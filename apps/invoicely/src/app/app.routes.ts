import { Route } from '@angular/router';
import { authGuard, guestGuard } from './_infrastructure/guards';

export const appRoutes: Route[] = [
  // Auth routes (accessible only when not authenticated)
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },

  // Protected routes (accessible only when authenticated)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./_shared/layouts/main-layout/main-layout').then(
        (m) => m.MainLayout
      ),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./invoices/invoices.routes').then((m) => m.invoicesRoutes),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./clients/clients.routes').then((m) => m.clientsRoutes),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.routes').then((m) => m.paymentsRoutes),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.routes').then((m) => m.reportsRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((m) => m.settingsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.routes').then((m) => m.profileRoutes),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
