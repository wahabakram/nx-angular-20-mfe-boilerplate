import { Component, inject, input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Icon } from '../../icon/icon';

@Component({
  selector: 'mf-alert-dialog',
  imports: [Icon],
  templateUrl: './alert-dialog.html',
  styleUrls: ['./alert-dialog.scss'],
})
export class AlertDialog {
  data = input<{ message: string; variant: string }>();
  private dialogRef = inject(MatDialogRef<AlertDialog>);

  getIcon(): string {
    switch (this.data()?.variant) {
      case 'success':
        return 'solar:check-circle-line-duotone';
      case 'warning':
        return 'solar:danger-triangle-line-duotone';
      case 'error':
        return 'solar:close-circle-line-duotone';
      default:
        return 'solar:info-circle-line-duotone';
    }
  }

  onFooterAction(buttonId: string): void {
    this.dialogRef.close(buttonId);
  }
}
