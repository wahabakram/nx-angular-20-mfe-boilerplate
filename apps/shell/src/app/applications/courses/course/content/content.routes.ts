import { Route } from '@angular/router';

export const contentRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./content/content').then((c) => c.Content),
  },
  {
    path: 'lesson/:id',
    loadComponent: () => import('./lesson/lesson').then((c) => c.Lesson),
  },
  {
    path: 'quiz/:id',
    loadComponent: () => import('./quiz/quiz').then((c) => c.Quiz),
  },
];
