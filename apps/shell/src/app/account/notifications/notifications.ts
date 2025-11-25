import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import {
  NotificationControlsDefDirective,
  NotificationDefDirective,
  NotificationList,
  NotificationPropsDirective,
  INotification,
} from '@ng-mf/components';
import {
  InviteToEditFilesInFolderNotification,
  MentionedInCommentNotification,
} from '@/components/notifications';
import { Container } from '@/_partials/container/container';
import { BreadcrumbsStore } from '@ng-mf/components';
import { ACCOUNT_NOTIFICATIONS } from '@/account/mock-data/account-notifications.mock';

@Component({
  imports: [
    NotificationList,
    NotificationDefDirective,
    InviteToEditFilesInFolderNotification,
    MentionedInCommentNotification,
    NotificationPropsDirective,
    MatIcon,
    NotificationControlsDefDirective,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuTrigger,
    Container,
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  notifications = signal<INotification[]>(ACCOUNT_NOTIFICATIONS);

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
        name: 'Account',
        route: '/account/notifications',
        type: 'link',
      },
      {
        id: 'billing',
        name: 'Notifications',
        type: null,
      },
    ]);
  }
}
