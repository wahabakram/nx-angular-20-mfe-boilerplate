import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'getting-started',
  },
  {
    path: 'basic',
    title: 'Basic Dashboard',
    loadComponent: () => import('./basic/basic').then(c => c.Basic)
  },
  {
    path: 'getting-started',
    title: 'Getting Started',
    loadComponent: () => import('./getting-started/getting-started').then(c => c.GettingStarted)
  },
  {
    path: 'ecommerce',
    title: 'Ecommerce Dashboard',
    loadComponent: () => import('./ecommerce/ecommerce').then(c => c.Ecommerce)
  },
  {
    path: 'finance',
    title: 'Finance Dashboard',
    loadComponent: () => import('./finance/finance').then(c => c.Finance)
  },
  {
    path: 'explore',
    title: 'Explore Dashboard',
    loadComponent: () => import('./explore/explore').then(c => c.Explore)
  },
  {
    path: 'analytics',
    title: 'Analytics',
    loadComponent: () => import('./analytics/analytics').then(c => c.Analytics)
  },
  {
    path: 'dynamic',
    loadChildren: () => import('./dynamic/dynamic.routes').then(m => m.dynamicRoutes)
  },
];
