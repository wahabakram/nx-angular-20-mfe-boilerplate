import { Route } from '@angular/router';
// import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/error.routes').then((m) => m.errorRoutes),
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./onboarding/onboarding.routes').then((m) => m.onboardingRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./app/app').then((c) => c.App),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('./user-profile/user-profile.routes').then(
            (m) => m.userProfileRoutes
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.routes').then((m) => m.accountRoutes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./widgets/widgets.routes').then((m) => m.widgetsRoutes),
      },
      {
        path: 'cards',
        loadChildren: () =>
          import('./cards/cards.routes').then((m) => m.cardsRoutes),
      },
      {
        path: 'prebuilt-components',
        loadChildren: () =>
          import('./prebuilt-components/prebuilt-components.routes').then(
            (m) => m.prebuiltComponentsRoutes
          ),
      },
      {
        path: 'pricing',
        loadChildren: () =>
          import('./pricing/pricing.routes').then((m) => m.pricingRoutes),
      },
      {
        path: 'applications',
        loadChildren: () =>
          import('./applications/applications.routes').then(
            (m) => m.applicationsRoutes
          ),
      },
      {
        path: 'content',
        loadChildren: () =>
          import('./content/content.routes').then((m) => m.contentRoutes),
      },
      {
        path: 'service-pages',
        loadChildren: () =>
          import('./service-pages/service-pages.routes').then(
            (m) => m.servicePagesRoutes
          ),
      },
      {
        path: 'themes',
        loadChildren: () =>
          import('./themes/themes.routes').then((m) => m.themesRoutes),
      },
      {
        path: 'integrations',
        loadChildren: () =>
          import('./integrations/integrations.routes').then(
            (m) => m.integrationsRoutes
          ),
      },
      {
        path: 'datatables',
        loadChildren: () =>
          import('./datatables/datatables.routes').then(
            (m) => m.datatablesRoutes
          ),
      },
      {
        path: 'management/posts',
        loadChildren: () =>
          import('./management/posts/posts.routes').then((m) => m.postsRoutes),
      },
    ],
  },
  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./error/not-found/not-found').then((c) => c.NotFound),
  },
];
