import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Page } from '@/meta/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  InviteToProjectDialog
} from '@/prebuilt-components/dialogs/_examples/invite-to-project/invite-to-project.dialog';

@Component({
  imports: [
    Page,
    PageContentDirective,
    MatButton
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private dialog = inject(MatDialog);

  openInviteToProjectDialog() {
    this.dialog.open(InviteToProjectDialog, {
      width: '600px',
    });
  }
}
