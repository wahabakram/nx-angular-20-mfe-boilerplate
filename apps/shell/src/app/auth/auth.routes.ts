import { Route } from '@angular/router';

export const authRoutes: Route[] = [
  {
    path: 'sign-in',
    loadComponent: () => import('./signin/signin').then((c) => c.Signin),
    title: 'Sign In',
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((c) => c.Signup),
    title: 'Sign Up',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password').then((c) => c.ForgotPassword),
    title: 'Forgot Password',
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./password-reset/password-reset').then((c) => c.PasswordReset),
    title: 'Password Reset',
  },
  {
    path: 'set-new-password',
    loadComponent: () =>
      import('./set-new-password/set-new-password').then(
        (c) => c.SetNewPassword
      ),
    title: 'Set New Password',
  },
  {
    path: 'done',
    loadComponent: () => import('./done/done').then((c) => c.Done),
    title: 'Done',
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./create-account/create-account').then((c) => c.CreateAccount),
    title: 'Create Account',
  },
];
