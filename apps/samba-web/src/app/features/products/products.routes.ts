import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list/product-list').then((m) => m.ProductList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./product-form/product-form').then((m) => m.ProductForm),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./product-form/product-form').then((m) => m.ProductForm),
  },
];
