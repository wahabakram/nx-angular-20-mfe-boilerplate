import { Route } from '@angular/router';

export const calendarRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./calendar/calendar').then((c) => c.Calendar),
  },
];
