import { Component, DestroyRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { HorizontalDivider } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { MatDialog } from '@angular/material/dialog';
import {
  ChangeEmailDialog
} from '@/account/settings/_dialogs/change-email-dialog/change-email-dialog';
import {
  ChangePasswordDialog
} from '@/account/settings/_dialogs/change-password-dialog/change-password-dialog';
import { ConfirmManager } from '@ng-mf/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    MatButton,
    MatSlideToggle,
    FormsModule,
    HorizontalDivider
  ],
  templateUrl: './security.html',
  styleUrl: './security.scss'
})
export class Security {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private dialog = inject(MatDialog);
  private confirmManager = inject(ConfirmManager);
  private destroyRef = inject(DestroyRef);

  securityProfile = {
    email: 'youremail@example.com',
    isEmailVerified: false,
    mfaConfigured: false,
    mfaEnabled: false
  };

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'security',
        name: 'Security',
        type: null
      }
    ]);
  }

  editEmail() {
    const dialogRef = this.dialog.open(ChangeEmailDialog, {
      width: '500px',
      data: {
        email: this.securityProfile.email
      }
    });
    dialogRef.afterClosed().subscribe((email: string) => {
      if (email && email !== this.securityProfile.email) {
        this.securityProfile.email = email;
        this.securityProfile.isEmailVerified = false;
      }
    });
  }

  verifyEmail() {
    this.securityProfile.isEmailVerified = true;
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialog, {
      width: '500px',
      data: {
      }
    });
  }

  deactivateAccount() {
    const confirmRef = this.confirmManager.open({
      title: 'Account deactivation',
      description: 'Are you sure you want to deactivate your account?',
    });
    confirmRef
      .confirmed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('Account deactivated');
      });
  }

  deleteAccount() {
    const confirmRef = this.confirmManager.open({
      title: 'Account deletion',
      description: 'Are you sure you want to delete your account?',
    });
    confirmRef
      .confirmed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('Account deleted');
      });
  }

  setup2stepVerification() {
    this.securityProfile.mfaConfigured = true;
    this.securityProfile.mfaEnabled = true;
  }
}
