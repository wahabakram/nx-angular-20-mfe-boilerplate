import { Component } from '@angular/core';
import {
  INotification,
  NotificationDefDirective,
  NotificationList,
} from '@ng-mf/components';
import { MentionedInCommentNotification } from '@/components/notifications';

@Component({
  selector: 'app-mentioned-in-comment-notification-example',
  imports: [
    NotificationDefDirective,
    NotificationList,
    MentionedInCommentNotification,
  ],
  templateUrl: './mentioned-in-comment-notification-example.html',
  styleUrl: './mentioned-in-comment-notification-example.scss',
})
export class MentionedInCommentNotificationExample {
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
        avatarUrl: 'assets/avatars/6.svg',
      },
      payload: {
        content: 'what did you say?',
      },
      type: 'mentionedInComment',
      createdAt: '1 hour ago',
    },
  ];
}
