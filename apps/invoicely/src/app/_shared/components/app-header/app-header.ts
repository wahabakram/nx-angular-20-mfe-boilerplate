import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthStore } from '@invoicely/domain/user/store';
import { Avatar, HorizontalDivider } from '@ng-mf/components';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    Avatar,
    HorizontalDivider,
  ],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  authStore = inject(AuthStore);
  private router = inject(Router);

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
