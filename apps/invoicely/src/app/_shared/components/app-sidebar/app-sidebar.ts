import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthStore } from '@invoicely/domain/user/store';
import { AuthApiService } from '@invoicely/infrastructure/api';
import { Avatar, ConfirmManager } from '@ng-mf/components';
import { NgFor } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgFor,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    Avatar,
  ],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.scss',
})
export class AppSidebar {
  authStore = inject(AuthStore);
  private authApi = inject(AuthApiService);
  private router = inject(Router);
  private confirmManager = inject(ConfirmManager);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Invoices', icon: 'receipt_long', route: '/invoices' },
    { label: 'Clients', icon: 'people', route: '/clients' },
    { label: 'Payments', icon: 'payment', route: '/payments' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  onLogout(): void {
    const confirmRef = this.confirmManager.open({
      title: 'Confirm Logout',
      description: 'Are you sure you want to logout?',
    });

    confirmRef.confirmed.subscribe(() => {
      this.authApi.logout().subscribe({
        next: () => {
          this.router.navigate(['/auth/signin']);
        },
      });
    });
  }
}
