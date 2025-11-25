import { Component, inject, signal } from '@angular/core';
import { EventsWidget } from '@/widgets/_widgets/events-widget/events-widget';
import { TeamWidget } from '@/widgets/_widgets/team-widget/team-widget';
import { TotalTasksWidget } from '@/widgets/_widgets/total-tasks-widget/total-tasks-widget';
import { TotalProjectsWidget } from '@/widgets/_widgets/total-projects-widget/total-projects-widget';
import { TasksInProgressWidget } from '@/widgets/_widgets/tasks-in-progress-widget/tasks-in-progress-widget';
import { TodosWidget } from '@/widgets/_widgets/todos-widget/todos-widget';
import { ActionRequiredWidget } from '@/widgets/_widgets/action-required-widget/action-required-widget';
import {
  Attendee,
  SprintMeetingWidget,
} from '@/widgets/_widgets/sprint-meeting-widget/sprint-meeting-widget';
import { TeamMeetingWidget } from '@/widgets/_widgets/team-meeting-widget/team-meeting-widget';
import { TeamSessionWidget } from '@/widgets/_widgets/team-session-widget/team-session-widget';
import {
  BreadcrumbsStore,
  SequentialBackgroundDirective,
} from '@ng-mf/components';
import {
  BasicMetricWidget,
  IBasicMetricWidget,
} from '@/widgets/_widgets/basic-metric-widget/basic-metric-widget';
import { DailyLimitWidget } from '@/widgets/_widgets/daily-limit-widget/daily-limit-widget';
import { GettingStartedWidget } from '@/widgets/_widgets/getting-started-widget/getting-started-widget';
import { RecentEventsWidget } from '@/widgets/_widgets/recent-events-widget/recent-events-widget';
import { WelcomeWidget } from '@/widgets/_widgets/welcome-widget/welcome-widget';

@Component({
  imports: [
    EventsWidget,
    TeamWidget,
    TotalTasksWidget,
    TotalProjectsWidget,
    TasksInProgressWidget,
    TodosWidget,
    ActionRequiredWidget,
    SprintMeetingWidget,
    TeamMeetingWidget,
    TeamSessionWidget,
    BasicMetricWidget,
    SequentialBackgroundDirective,
    DailyLimitWidget,
    GettingStartedWidget,
    RecentEventsWidget,
    WelcomeWidget,
  ],
  templateUrl: './general.html',
  styleUrl: './general.scss',
})
export class General {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly actionRequiredWidget = signal({
    id: 20,
    type: 'action-required-widget',
    columns: 12,
    description:
      'Please provide your company details to access our services seamlessly, whether forming a new company or adding existing information.',
    buttonText: 'Fix the problem',
    actionText: 'Warning',
  });
  springMeetingTitle = signal('Sprint Setup - Product Team');
  springMeetingTime = signal('04:30 - 5:30 PM');

  teamMeetingTitle = signal('Team Meeting - Next Release');
  teamMeetingTime = signal('02:30 - 4:00 PM');

  teamSessionTitle = signal('Team Meeting - Next Release');
  teamSessionTime = signal('01:30 - 2:00 PM');

  // Use real image URLs for the avatars
  meetingAttendees = signal<Attendee[]>([
    {
      name: 'User 1',
      imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    {
      name: 'User 2',
      imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      name: 'User 3',
      imageUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    },
    {
      name: 'User 4',
      imageUrl: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    },
    {
      name: 'User 5',
      imageUrl: 'https://i.pravatar.cc/150?u=a092581f4e29026702d',
    },
  ]);

  viewsWidget = signal<IBasicMetricWidget>({
    id: 1,
    data: {
      name: 'Views',
      value: 7265,
      percentageChange: 11.01,
    },
  });
  visitsWidget = signal<IBasicMetricWidget>({
    id: 2,
    data: {
      name: 'Visits',
      value: 14046,
      percentageChange: -0.03,
    },
  });
  newUsersWidget = signal<IBasicMetricWidget>({
    id: 2,
    data: {
      name: 'New Users',
      value: 56,
      percentageChange: 14.79,
    },
  });

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Widgets',
        route: '/widgets/general',
        type: 'link',
      },
      {
        id: 'general',
        name: 'General',
        type: null,
      },
    ]);
  }
}
