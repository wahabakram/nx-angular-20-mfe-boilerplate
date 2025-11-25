import { Route } from '@angular/router';

export const helpCenterRoutes: Route[] = [
  {
    path: 'main',
    loadComponent: () => import('./main/main').then((c) => c.Main),
    title: 'Help Center',
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq').then((c) => c.Faq),
    title: 'Help Center | FAQ',
  },
  {
    path: 'guides',
    loadComponent: () => import('./guides/guides').then((c) => c.Guides),
    title: 'Help Center | Guides',
  },
  {
    path: 'support',
    loadComponent: () => import('./support/support').then((c) => c.Support),
    title: 'Help Center | Support',
  },
];
