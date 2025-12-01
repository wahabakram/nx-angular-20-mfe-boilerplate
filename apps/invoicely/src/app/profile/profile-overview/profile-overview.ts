import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '@invoicely/domain/user/store';
import { Avatar } from '@ng-mf/components';

@Component({
  selector: 'app-profile-overview',
  imports: [MatCardModule, MatIconModule, MatButtonModule, Avatar],
  template: `
    <div class="page-container">
      <h1>Profile</h1>

      <mat-card class="profile-card">
        <mat-card-content>
          <div class="profile-header">
            <mf-avatar
              [label]="authStore.userInitials()"
              class="size-16">
            </mf-avatar>
            <div class="profile-info">
              <h2>{{ authStore.userFullName() }}</h2>
              <p>{{ authStore.user()?.email }}</p>
            </div>
          </div>

          <div class="profile-actions">
            <button mat-raised-button color="primary">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <button mat-raised-button>
              <mat-icon>lock</mat-icon>
              Change Password
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      h1 {
        margin: 0 0 2rem 0;
        font-size: 2rem;
        font-weight: 700;
      }

      .profile-card {
        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;

          .profile-info {
            h2 {
              margin: 0 0 0.5rem 0;
              font-size: 1.5rem;
              font-weight: 700;
            }

            p {
              margin: 0;
              color: #6b7280;
            }
          }
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;

          button mat-icon {
            margin-right: 0.5rem;
          }
        }
      }
    }
  `],
})
export class ProfileOverview {
  authStore = inject(AuthStore);
}
