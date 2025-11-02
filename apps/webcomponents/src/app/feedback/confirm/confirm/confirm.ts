import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mfc-confirm',
  exportAs: 'mfcConfirm',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    ReactiveFormsModule,
    MatDialogClose
  ],
  templateUrl: './confirm.html',
  styleUrl: './confirm.scss',
  host: {
    'class': 'mfc-confirm'
  }
})
export class Confirm {
  private _data = inject(DIALOG_DATA);
  private _dialogRef = inject(DialogRef);

  title = this._data.title;
  description = this._data.description;
}

// Export alias for backward compatibility
export { Confirm as ConfirmComponent };
