import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./profile-overview/profile-overview').then((m) => m.ProfileOverview),
  },
];
