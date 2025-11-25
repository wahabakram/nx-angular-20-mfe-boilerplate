import { Route } from '@angular/router';

export const contactsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./contacts/contacts').then((c) => c.Contacts),
  },
];
