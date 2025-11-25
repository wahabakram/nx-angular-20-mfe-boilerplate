import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'mf-add-link',
  imports: [
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    MatLabel,
    MatSlideToggle
  ],
  templateUrl: './add-link.dialog.html',
  styleUrl: './add-link.dialog.css'
})
export class AddLinkDialog {
  private _dialogRef = inject(MatDialogRef);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    href: [''],
    openInNewTab: [true, [Validators.required]]
  });

  cancel() {
    this._dialogRef.close(false);
  }

  add() {
    this._dialogRef.close(this.form.value);
  }
}
