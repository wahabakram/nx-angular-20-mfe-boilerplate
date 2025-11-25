import { Route } from '@angular/router';

export const userProfileRoutes: Route[] = [
  {
    path: 'talent-profile',
    title: 'Talent Profile',
    loadComponent: () => import('./talent-profile/talent-profile').then(c => c.TalentProfile)
  },
  {
    path: 'overview',
    title: 'User Profile Overview',
    loadComponent: () => import('./overview/overview').then(c => c.Overview)
  }
];
