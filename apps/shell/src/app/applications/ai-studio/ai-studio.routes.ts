import { Route } from '@angular/router';

export const aiRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./ai-studio/ai-studio').then((c) => c.AiStudio),
  },
];
