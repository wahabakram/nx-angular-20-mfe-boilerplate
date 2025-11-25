import { Route } from '@angular/router';

export const servicePagesRoutes: Route[] = [
  {
    path: 'pending-email-activation',
    loadComponent: () => import('./pending-email-activation/pending-email-activation').then(c => c.PendingEmailActivation),
    title: 'Pending Email Activation'
  },
  {
    path: 'integrations',
    loadComponent: () => import('./integrations/integrations').then(c => c.Integrations),
    title: 'Integrations'
  }
];
