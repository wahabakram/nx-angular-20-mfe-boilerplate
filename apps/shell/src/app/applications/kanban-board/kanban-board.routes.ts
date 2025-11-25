import { Route } from '@angular/router';

export const kanbanBoardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./kanban-board/kanban-board').then((c) => c.KanbanBoard),
  },
];
