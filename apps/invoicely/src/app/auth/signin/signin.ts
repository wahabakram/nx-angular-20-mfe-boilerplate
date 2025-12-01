import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { AuthStore } from '@invoicely/domain/user/store';
import { Alert } from '@ng-mf/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Alert,
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class SignIn {
  private fb = inject(FormBuilder);
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  authStore = inject(AuthStore);

  errorMessage = '';
  hidePassword = true;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { email, password } = this.form.value;

    this.authApi.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Login failed. Please try again.';
      },
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
