import { Route } from '@angular/router';

export const prebuiltComponentsRoutes: Route[] = [
  {
    path: 'skeleton',
    loadChildren: () => import('./skeleton/skeleton.routes').then(m => m.skeletonRoutes),
    title: 'Skeleton'
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.routes').then(m => m.notificationsRoutes),
    title: 'Notifications'
  },
  {
    path: 'selects',
    loadChildren: () => import('./selects/selects.routes').then(m => m.selectsRoutes),
    title: 'Selects'
  },
  {
    path: 'dialogs',
    loadChildren: () => import('./dialogs/dialogs.routes').then(m => m.dialogsRoutes),
    title: 'Dialogs'
  },
];
