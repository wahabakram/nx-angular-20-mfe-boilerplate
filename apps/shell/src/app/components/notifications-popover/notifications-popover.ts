import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatAnchor, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { Popover } from '@ng-mf/components';
import {
  NotificationDefDirective,
  NotificationList,
  INotification,
  NotificationActor,
  NotificationAvatarDirective,
  Notification,
  NotificationContent,
  NotificationMessage,
  NotificationTime,
} from '@ng-mf/components';
import { Dicebear } from '@ng-mf/components';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-notifications-popover',
  imports: [
    Popover,
    NotificationDefDirective,
    NotificationList,
    RouterLink,
    MatAnchor,
    MatIcon,
    MatIconButton,
    MatRipple,
    Dicebear,
    NotificationActor,
    NotificationAvatarDirective,
    Notification,
    NotificationContent,
    NotificationMessage,
    NotificationTime,
    Icon,
  ],
  templateUrl: './notifications-popover.html',
  styleUrl: './notifications-popover.scss',
})
export class NotificationsPopover {
  notifications: INotification[] = [
    {
      actor: {
        id: 1,
        name: 'Justin Hansen',
        username: 'justin.hansen',
        avatarUrl: 'assets/avatars/5.svg',
      },
      notifier: {
        id: 2,
        name: 'Elma Johnson',
        username: 'elma.johnson',
        avatarUrl: 'assets/avatars/2.svg',
      },
      payload: {
        content: 'what did you say?',
      },
      type: 'mentionedInComment',
      createdAt: '1 hour ago',
    },
    {
      actor: {
        id: 3,
        name: 'Johnny Gladden',
        username: 'johnny.gladden',
        avatarUrl: 'assets/avatars/6.svg',
      },
      notifier: {
        id: 4,
        name: 'Angela Naylor',
        username: 'angela.naylor',
        avatarUrl: 'assets/avatars/3.svg',
      },
      payload: {
        folderName: 'My New Project',
      },
      type: 'inviteToEditFilesInFolder',
      createdAt: '2 hours ago',
    },
  ];
}
