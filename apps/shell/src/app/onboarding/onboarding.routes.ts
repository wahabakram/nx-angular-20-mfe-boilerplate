import { Route } from '@angular/router';

export const onboardingRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./onboarding/onboarding').then(c => c.Onboarding),
    title: 'Onboarding'
  }
];
