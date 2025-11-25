import { Component, inject, input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mf-loading-dialog',
  templateUrl: './loading-dialog.html',
  styleUrls: ['./loading-dialog.scss'],
})
export class LoadingDialog {
  data = input<{ message: string }>();
  private dialogRef = inject(MatDialogRef<LoadingDialog>);
}
