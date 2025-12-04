import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthStore } from '@samba/user-domain';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Logo } from '@ng-mf/components';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    Logo,
    NgOptimizedImage
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  isLoading = signal(false);
  error = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.isLoading.set(false);

        // Redirect based on user role
        const role = this.authStore.userRole();

        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'manager') {
          this.router.navigate(['/manager/dashboard']);
        } else {
          this.router.navigate(['/pos']);
        }
      },
      error: (err) => {
        this.error.set(err?.error?.message || err?.message || 'Login failed');
        this.isLoading.set(false);
      }
    });
  }

  // Utility methods for template
  get usernameControl() {
    return this.loginForm.controls.username;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  hasError(controlName: 'username' | 'password', errorName: string): boolean {
    const control = this.loginForm.controls[controlName];
    return control.hasError(errorName) && (control.dirty || control.touched);
  }
}
