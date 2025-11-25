import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatInput, MatLabel } from '@angular/material/input';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { ButtonDirective } from '@ng-mf/components';
import { passwordMatchValidator } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    ButtonDirective,
    MatError,
    MatIcon,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './change-password-dialog.html',
  styleUrl: './change-password-dialog.scss'
})
export class ChangePasswordDialog {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);

  form = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: passwordMatchValidator('password', 'confirmPassword')
  });
  saving = signal(false);
  hidePassword = signal(true);

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.saving.set(true);
      console.log(this.form.value);

      setTimeout(() => {
        this.dialogRef.close(true);
      }, 1000);
    }
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update((value: boolean) => !value);
  }
}
