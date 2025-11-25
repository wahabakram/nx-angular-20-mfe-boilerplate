import { Route } from '@angular/router';

export const courseRoutes: Route[] = [
  {
    path: ':id',
    loadComponent: () => import('./common/common').then((c) => c.Common),
    children: [
      {
        path: 'overview',
        loadComponent: () =>
          import('./overview/overview').then((c) => c.Overview),
        title: 'Overview Course',
      },
      {
        path: 'content',
        loadChildren: () =>
          import('./content/content.routes').then((m) => m.contentRoutes),
        title: 'New Course',
      },
      {
        path: 'content',
        loadChildren: () =>
          import('./content/content.routes').then((m) => m.contentRoutes),
        title: 'Edit Course',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings').then((c) => c.Settings),
        title: 'Course Settings',
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./students/students').then((c) => c.Students),
        title: 'Students',
      },
      {
        path: 'landing',
        loadComponent: () => import('./landing/landing').then((c) => c.Landing),
        title: 'Landing Page',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./analytics/analytics').then((c) => c.Analytics),
        title: 'Course Analytics',
      },
    ],
  },
];
