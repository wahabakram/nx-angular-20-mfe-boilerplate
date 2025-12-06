import { Route } from '@angular/router';
import { authGuard, roleGuard } from '@samba/user-domain';
// import { loadRemote } from '@module-federation/enhanced/runtime';

/**
 * Main application routes for SAMBA ERP
 *
 * Architecture: Domain-Driven Design (DDD)
 * - Authentication routes (login, logout)
 * - Protected routes with auth guards and role-based access
 * - Feature modules: Dashboard, Products, Inventory, POS, Sales, Reports, Settings
 * - Multi-branch support
 * - Offline-first POS functionality
 */
export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // Authentication Routes (Public - No Layout)
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

  // Main Application Routes (Protected - With Layout)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./_partials/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      // Dashboard (All roles)
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/admin/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },

      // Products (Admin, Manager)
      {
        path: 'products',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(
            (m) => m.ProductList
          ),
      },
      {
        path: 'products/new',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadComponent: () =>
          import('./features/products/product-form/product-form').then(
            (m) => m.ProductForm
          ),
      },
      {
        path: 'products/edit/:id',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadComponent: () =>
          import('./features/products/product-form/product-form').then(
            (m) => m.ProductForm
          ),
      },

      // Inventory (Admin, Manager)
      {
        path: 'inventory',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadComponent: () =>
          import('./features/inventory/inventory-list/inventory-list').then(
            (m) => m.InventoryList
          ),
      },

      // POS (All roles)
      {
        path: 'pos',
        loadComponent: () =>
          import('./features/pos/pos-interface/pos-interface').then(
            (m) => m.PosInterface
          ),
      },

      // Sales & Quotations (Admin, Manager)
      {
        path: 'sales',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/sales/sales.routes').then((m) => m.salesRoutes),
      },

      // Reports (Admin, Manager)
      {
        path: 'reports',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/reports/reports.routes').then((m) => m.reportsRoutes),
      },

      // Settings & Administration (Admin only)
      {
        path: 'settings',
        canActivate: [roleGuard(['admin'])],
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
    ],
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
    redirectTo: 'dashboard',
  },
];
