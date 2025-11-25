import { Route } from '@angular/router';

export const coursesRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () => import('./courses/courses').then((c) => c.Courses),
    title: 'Courses',
  },
  {
    path: 'course',
    loadChildren: () =>
      import('./course/course.routes').then((m) => m.courseRoutes),
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./details/details').then((c) => c.CourseDetails),
    title: 'Course Details',
  },
];
