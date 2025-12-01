import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings-overview/settings-overview').then((m) => m.SettingsOverview),
  },
];
