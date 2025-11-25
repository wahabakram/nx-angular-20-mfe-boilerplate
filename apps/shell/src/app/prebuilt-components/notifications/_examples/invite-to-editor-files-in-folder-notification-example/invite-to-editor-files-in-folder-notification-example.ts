import { Component } from '@angular/core';
import {
  NotificationDefDirective,
  NotificationList,
  INotification,
} from '@ng-mf/components';
import { InviteToEditFilesInFolderNotification } from '@/components/notifications';

@Component({
  selector: 'app-invite-to-editor-files-in-folder-notification-example',
  imports: [
    InviteToEditFilesInFolderNotification,
    NotificationDefDirective,
    NotificationList,
  ],
  templateUrl: './invite-to-editor-files-in-folder-notification-example.html',
  styleUrl: './invite-to-editor-files-in-folder-notification-example.scss',
})
export class InviteToEditorFilesInFolderNotificationExample {
  notifications: INotification[] = [
    {
      actor: {
        id: 3,
        name: 'Johnny Gladden',
        username: 'johnny.gladden',
        avatarUrl: 'assets/avatars/1.svg',
      },
      notifier: {
        id: 4,
        name: 'Angela Naylor',
        username: 'angela.naylor',
        avatarUrl: 'assets/avatars/6.svg',
      },
      payload: {
        folderName: 'My New Project',
      },
      isNew: true,
      type: 'inviteToEditFilesInFolder',
      createdAt: '2 hours ago',
    },
  ];
}
