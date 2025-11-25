import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'mf-edit-link',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSlideToggle,
    ReactiveFormsModule,
    MatDialogClose,
    MatHint
  ],
  templateUrl: './edit-link.dialog.html',
  styleUrl: './edit-link.dialog.css'
})
export class EditLinkDialog {
  private _dialogRef = inject(MatDialogRef);
  private _dialogData = inject(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    href: [this._dialogData.href],
    openInNewTab: [this._dialogData.openInNewTab, [Validators.required]]
  });

  cancel() {
    this._dialogRef.close(false);
  }

  add() {
    this._dialogRef.close(this.form.value);
  }
}
