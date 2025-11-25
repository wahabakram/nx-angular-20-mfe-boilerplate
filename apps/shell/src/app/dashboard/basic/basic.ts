import { Component, inject, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { Page } from '@/_partials/page/page';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [Dashboard, Page],
  templateUrl: './basic.html',
  styleUrl: './basic.scss',
})
export class Basic {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'total-subscribers-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/total-subscribers-widget/total-subscribers-widget'
        ).then((c) => c.TotalSubscribersWidget),
    },
    {
      type: 'avg-open-rate-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/avg-open-rate-widget/avg-open-rate-widget'
        ).then((c) => c.AvgOpenRateWidget),
    },
    {
      type: 'avg-click-rate-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/avg-click-rate-widget/avg-click-rate-widget'
        ).then((c) => c.AvgClickRateWidget),
    },
    {
      type: 'unique-visitors-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/unique-visitors-widget/unique-visitors-widget'
        ).then((c) => c.UniqueVisitorsWidget),
    },
    {
      type: 'total-tasks-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/total-tasks-widget/total-tasks-widget').then(
          (c) => c.TotalTasksWidget
        ),
    },
    {
      type: 'total-projects-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/total-projects-widget/total-projects-widget'
        ).then((c) => c.TotalProjectsWidget),
    },
    {
      type: 'events-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/events-widget/events-widget').then(
          (c) => c.EventsWidget
        ),
    },
    {
      type: 'team-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/team-widget/team-widget').then(
          (c) => c.TeamWidget
        ),
    },
    {
      type: 'tasks-in-progress-widget',
      component: () =>
        import(
          '@/widgets/_widgets/tasks-in-progress-widget/tasks-in-progress-widget'
        ).then((c) => c.TasksInProgressWidget),
    },
    {
      type: 'todos-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/todos-widget/todos-widget').then(
          (c) => c.TodosWidget
        ),
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: 1,
      type: 'total-subscribers-widget',
      columns: 3,
    },
    {
      id: 2,
      type: 'avg-open-rate-widget',
      columns: 3,
    },
    {
      id: 3,
      type: 'avg-click-rate-widget',
      columns: 3,
    },
    {
      id: 4,
      type: 'unique-visitors-widget',
      columns: 3,
    },
    {
      id: 5,
      type: 'total-tasks-widget',
      columns: 3,
      skeletonHeight: '260px',
    },
    {
      id: 6,
      type: 'total-projects-widget',
      columns: 3,
      skeletonHeight: '260px',
    },
    {
      id: 7,
      type: 'events-widget',
      columns: 3,
      skeletonHeight: '260px',
    },
    {
      id: 8,
      type: 'team-widget',
      columns: 3,
      skeletonHeight: '260px',
    },
    {
      id: 9,
      type: 'tasks-in-progress-widget',
      columns: 6,
      skeletonHeight: '400px',
    },
    {
      id: 10,
      type: 'todos-widget',
      columns: 6,
      skeletonHeight: '4000px',
    },
  ]);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'basic',
        name: 'Basic',
        type: null,
      },
    ]);
  }
}
