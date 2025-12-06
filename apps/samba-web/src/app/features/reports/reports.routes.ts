import { Route } from '@angular/router';

export const reportsRoutes: Route[] = [
  {
    path: 'sales',
    loadComponent: () => import('./sales-report/sales-report').then(m => m.SalesReport),
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventory-report/inventory-report').then(m => m.InventoryReport),
  },
  {
    path: '',
    redirectTo: 'sales',
    pathMatch: 'full',
  },
];
