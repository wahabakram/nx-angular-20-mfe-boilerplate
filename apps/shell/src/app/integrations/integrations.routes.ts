import { Route } from '@angular/router';

export const integrationsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./integrations/integrations').then(c => c.Integrations),
    title: 'Integrations'
  }
];
