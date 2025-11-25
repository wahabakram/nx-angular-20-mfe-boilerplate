import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Dicebear, INotification } from '@ng-mf/components';
import {
  NotificationActor,
  NotificationAvatarDirective,
  Notification,
  NotificationContent,
  NotificationMessage,
  NotificationTime,
} from '@ng-mf/components';

@Component({
  selector: 'app-invite-to-edit-files-in-folder',
  imports: [
    MatIcon,
    Dicebear,
    NotificationAvatarDirective,
    NotificationActor,
    NotificationMessage,
    NotificationTime,
    NotificationContent,
    Notification,
  ],
  templateUrl: './invite-to-edit-files-in-folder.notification.html',
  styleUrl: './invite-to-edit-files-in-folder.notification.scss',
})
export class InviteToEditFilesInFolderNotification {
  notification = input.required<INotification>();
}
