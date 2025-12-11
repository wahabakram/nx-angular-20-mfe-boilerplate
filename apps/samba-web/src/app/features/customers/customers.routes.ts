import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer-list/customer-list').then((m) => m.CustomerList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./customer-form/customer-form').then((m) => m.CustomerForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./customer-form/customer-form').then((m) => m.CustomerForm),
  },
  {
    path: ':id/ledger',
    loadComponent: () =>
      import('./customer-ledger/customer-ledger').then((m) => m.CustomerLedger),
  },
  {
    path: ':id/payment',
    loadComponent: () =>
      import('./customer-payment/customer-payment').then((m) => m.CustomerPayment),
  },
];
