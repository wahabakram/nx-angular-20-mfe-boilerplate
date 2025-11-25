import { Route } from '@angular/router';

export const messengerRoutes: Route[] = [
{
    path: '',
    loadComponent: () => import('./messenger/messenger').then(c => c.Messenger),
  }
];
