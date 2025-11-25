import { Component, inject } from '@angular/core';
import {
  InviteToEditorFilesInFolderNotificationExample
} from '../_examples/invite-to-editor-files-in-folder-notification-example/invite-to-editor-files-in-folder-notification-example';
import {
  MentionedInCommentNotificationExample
} from '../_examples/mentioned-in-comment-notification-example/mentioned-in-comment-notification-example';
import { Page } from '@/meta/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    Page,
    PageContentDirective,
    InviteToEditorFilesInFolderNotificationExample,
    MentionedInCommentNotificationExample
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        type: null
      }
    ]);
  }
}
