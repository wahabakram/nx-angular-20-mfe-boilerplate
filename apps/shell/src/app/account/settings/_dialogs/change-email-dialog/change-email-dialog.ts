import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ButtonDirective } from '@ng-mf/components';

@Component({
  selector: 'app-change-email-dialog',
  imports: [
    FormsModule,
    MatInput,
    MatLabel,
    MatDialogActions,
    MatFormField,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    ReactiveFormsModule,
    ButtonDirective
  ],
  templateUrl: './change-email-dialog.html',
  styleUrl: './change-email-dialog.scss'
})
export class ChangeEmailDialog {
  private formBuilder = inject(FormBuilder);
  private data = inject(DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);

  readonly form = this.formBuilder.group({
    email: [this.data.email, [Validators.required, Validators.email]]
  });
  readonly saving = signal(false);

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.saving.set(true);
      console.log(this.form.value);

      setTimeout(() => {
        this.dialogRef.close(this.form.value.email);
      }, 1000);
    }
  }
}
