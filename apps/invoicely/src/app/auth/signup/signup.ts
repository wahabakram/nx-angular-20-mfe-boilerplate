import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { AuthStore } from '@invoicely/domain/user/store';
import { Alert, PasswordStrength } from '@ng-mf/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Alert,
    PasswordStrength,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  authStore = inject(AuthStore);

  errorMessage = '';
  hidePassword = true;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { email, password, firstName, lastName } = this.form.value;

    this.authApi
      .register({
        email: email!,
        password: password!,
        firstName: firstName!,
        lastName: lastName!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage =
            error.message || 'Registration failed. Please try again.';
        },
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
