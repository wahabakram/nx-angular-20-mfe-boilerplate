import { Route } from '@angular/router';

export const invoiceRoutes: Route[] = [
  {
    path: 'list',
    loadComponent: () => import('./invoices/invoices').then((c) => c.Invoices),
    title: 'Invoices',
  },
  {
    path: 'details',
    loadComponent: () => import('./details/details').then((c) => c.Details),
    title: 'Invoice Details',
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new').then((c) => c.New),
    title: 'New Invoice',
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit/edit').then((c) => c.Edit),
    title: 'Edit Invoice',
  },
];
