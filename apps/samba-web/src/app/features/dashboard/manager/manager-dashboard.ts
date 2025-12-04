import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthStore } from '@samba/user-domain';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    CommonModule,
    MatIconButton,
    MatToolbar,
    MatIcon,
    MatCard,
    MatCardContent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDivider
  ],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss'
})
export class ManagerDashboard {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  user = this.authStore.user;

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
