import { Component, inject, input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'mfc-confirmation-dialog',
  imports: [Icon],
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.scss'],
})
export class ConfirmationDialog {
  data = input<{ message: string; variant: string }>();
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);

  getIcon(): string {
    switch (this.data()?.variant) {
      case 'warning':
        return 'solar:danger-triangle-line-duotone';
      case 'error':
        return 'solar:close-circle-line-duotone';
      default:
        return 'solar:question-circle-line-duotone';
    }
  }

  onFooterAction(buttonId: string): void {
    this.dialogRef.close(buttonId);
  }
}
