import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { Alert } from '@ng-mf/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Alert,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const { email } = this.form.value;

    this.authApi.forgotPassword({ email: email! }).subscribe({
      next: () => {
        this.successMessage =
          'Password reset instructions have been sent to your email.';
        this.form.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to send reset email.';
        this.isLoading = false;
      },
    });
  }
}
