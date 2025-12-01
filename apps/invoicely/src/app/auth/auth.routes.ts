import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../_shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./signin/signin').then((m) => m.SignIn),
      },
      {
        path: 'signup',
        loadComponent: () => import('./signup/signup').then((m) => m.SignUp),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: 'reset-password/:hash',
        loadComponent: () =>
          import('./reset-password/reset-password').then((m) => m.ResetPassword),
      },
      {
        path: 'verify-email/:hash',
        loadComponent: () =>
          import('./verify-email/verify-email').then((m) => m.VerifyEmail),
      },
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
    ],
  },
];
