import { Routes } from '@angular/router';

export const paymentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./payment-list/payment-list').then((m) => m.PaymentList),
  },
];
