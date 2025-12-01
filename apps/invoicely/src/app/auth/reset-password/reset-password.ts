import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { Alert, PasswordStrength } from '@ng-mf/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    Alert,
    PasswordStrength,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  errorMessage = '';
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  hash = '';

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.hash = this.route.snapshot.params['hash'];
    if (!this.hash) {
      this.errorMessage = 'Invalid reset link';
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authApi.resetPassword({ hash: this.hash, password: password! }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/signin'], {
          queryParams: { passwordReset: 'true' },
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to reset password.';
        this.isLoading = false;
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
