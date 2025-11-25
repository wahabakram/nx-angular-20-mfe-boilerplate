import { Route } from '@angular/router';

export const emailAppRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/common').then((c) => c.Common),
    children: [
      {
        path: '',
        redirectTo: 'inbox',
        pathMatch: 'full',
      },
      {
        path: 'inbox',
        loadComponent: () => import('./inbox/inbox').then((c) => c.Inbox),
        title: 'Inbox',
      },
      {
        path: 'sent',
        loadComponent: () => import('./sent/sent').then((c) => c.Sent),
        title: 'Sent',
      },
      {
        path: 'drafts',
        loadComponent: () => import('./drafts/drafts').then((c) => c.Drafts),
        title: 'Drafts',
      },
      {
        path: 'spam',
        loadComponent: () => import('./spam/spam').then((c) => c.Spam),
        title: 'Spam',
      },
      {
        path: 'trash',
        loadComponent: () => import('./trash/trash').then((c) => c.Trash),
        title: 'Trash',
      },
      {
        path: 'label/:label',
        loadComponent: () => import('./label/label').then((c) => c.Label),
        title: 'Label',
      },
    ],
  },
];
