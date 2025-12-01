import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { Alert } from '@ng-mf/components';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-verify-email',
  imports: [
    RouterLink,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Alert,
  ],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements OnInit {
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isVerifying = true;
  isSuccess = false;
  errorMessage = '';

  ngOnInit(): void {
    const hash = this.route.snapshot.params['hash'];

    if (!hash) {
      this.isVerifying = false;
      this.errorMessage = 'Invalid verification link';
      return;
    }

    this.verifyEmail(hash);
  }

  verifyEmail(hash: string): void {
    this.authApi.verifyEmail({ hash }).subscribe({
      next: () => {
        this.isVerifying = false;
        this.isSuccess = true;
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/signin'], {
            queryParams: { emailVerified: 'true' },
          });
        }, 3000);
      },
      error: (error) => {
        this.isVerifying = false;
        this.isSuccess = false;
        this.errorMessage = error.message || 'Email verification failed.';
      },
    });
  }

  goToSignIn(): void {
    this.router.navigate(['/auth/signin']);
  }
}
