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
        loadChildren: () =>
          import('./features/products/products.routes').then(
            (m) => m.productsRoutes
          ),
      },

      // Inventory (Admin, Manager)
      {
        path: 'inventory',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/inventory/inventory.routes').then(
            (m) => m.inventoryRoutes
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

      // Customers (Admin, Manager)
      {
        path: 'customers',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/customers/customers.routes').then(
            (m) => m.customersRoutes
          ),
      },

      // Suppliers (Admin, Manager)
      {
        path: 'suppliers',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/suppliers/suppliers.routes').then(
            (m) => m.suppliersRoutes
          ),
      },

      // Purchases (Admin, Manager)
      {
        path: 'purchases',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/purchases/purchases.routes').then(
            (m) => m.purchasesRoutes
          ),
      },

      // Stock Transfers (Admin, Manager)
      {
        path: 'stock-transfers',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () =>
          import('./features/stock-transfers/stock-transfers.routes').then(
            (m) => m.stockTransfersRoutes
          ),
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
