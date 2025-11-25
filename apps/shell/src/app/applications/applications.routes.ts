import { Route } from '@angular/router';

export const applicationsRoutes: Route[] = [
  {
    path: 'calendar',
    loadChildren: () =>
      import('./calendar/calendar.routes').then((m) => m.calendarRoutes),
    title: 'Calendar',
  },
  {
    path: 'messenger',
    loadChildren: () =>
      import('./messenger/messenger.routes').then((m) => m.messengerRoutes),
    title: 'Messenger',
  },
  {
    path: 'file-manager',
    loadChildren: () =>
      import('./file-manager/file-manager.routes').then(
        (m) => m.fileManagerRoutes
      ),
    title: 'File Manager',
  },
  {
    path: 'content-editor',
    loadComponent: () =>
      import('./content-editor/content-editor').then((m) => m.ContentEditor),
    title: 'Content Editor',
  },
  {
    path: 'kanban-board',
    loadChildren: () =>
      import('./kanban-board/kanban-board.routes').then(
        (m) => m.kanbanBoardRoutes
      ),
    title: 'Kanban Board',
  },
  {
    path: 'notes',
    loadChildren: () =>
      import('./notes/notes.routes').then((m) => m.notesRoutes),
    title: 'Notes',
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contacts/contacts.routes').then((m) => m.contactsRoutes),
    title: 'Contacts',
  },
  {
    path: 'help-center',
    loadChildren: () =>
      import('./help-center/help-center.routes').then(
        (m) => m.helpCenterRoutes
      ),
    title: 'Help Center',
  },
  {
    path: 'ai-studio',
    loadChildren: () =>
      import('./ai-studio/ai-studio.routes').then((m) => m.aiRoutes),
    title: 'AI Studio',
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('./invoice/invoice.routes').then((m) => m.invoiceRoutes),
  },
  {
    path: 'email-app',
    loadChildren: () =>
      import('./email-app/email-app.routes').then((m) => m.emailAppRoutes),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.projectsRoutes),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.routes').then((m) => m.coursesRoutes),
    title: 'Courses',
  },
];
