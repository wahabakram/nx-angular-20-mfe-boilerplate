import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Dicebear } from '@ng-mf/components';
import {
  INotification,
  NotificationActor,
  NotificationAvatarDirective,
  Notification,
  NotificationContent,
  NotificationMessage,
  NotificationTime,
} from '@ng-mf/components';

@Component({
  selector: 'app-mentioned-in-comment',
  imports: [
    MatIcon,
    Dicebear,
    NotificationActor,
    NotificationAvatarDirective,
    Notification,
    NotificationContent,
    NotificationMessage,
    NotificationTime,
  ],
  templateUrl: './mentioned-in-comment.notification.html',
  styleUrls: ['./mentioned-in-comment.notification.scss'],
})
export class MentionedInCommentNotification {
  notification = input.required<INotification>();
}
