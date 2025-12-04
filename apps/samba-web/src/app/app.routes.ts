import { Route } from '@angular/router';
import { authGuard, roleGuard } from '@samba/user-domain';
// import { loadRemote } from '@module-federation/enhanced/runtime';

/**
 * Main application routes for Electric Store POS & Inventory Management System
 *
 * Architecture: Domain-Driven Design (DDD)
 * - Authentication routes (login, logout)
 * - Protected routes with auth guards
 * - Feature modules: POS, Inventory, Sales, Reports, Settings
 * - Multi-branch support
 * - Offline-first POS functionality
 */
export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // Authentication Routes (Public)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.Login),
      },
    ],
  },

  // Admin Dashboard (Protected - Admin only)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/admin/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList
          ),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form').then(
            (m) => m.ProductForm
          ),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/products/product-form/product-form').then(
            (m) => m.ProductForm
          ),
      },
    ],
  },

  // Manager Dashboard (Protected - Manager only)
  {
    path: 'manager',
    canActivate: [authGuard, roleGuard(['manager'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/manager/manager-dashboard').then(
            (m) => m.ManagerDashboard
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/inventory-list/inventory-list').then(
            (m) => m.InventoryList
          ),
      },
    ],
  },

  // POS Routes (Protected - Cashier, Manager, Admin)
  {
    path: 'pos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pos/pos-interface/pos-interface').then(
        (m) => m.PosInterface
      ),
  },

  // Unauthorized Page
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
