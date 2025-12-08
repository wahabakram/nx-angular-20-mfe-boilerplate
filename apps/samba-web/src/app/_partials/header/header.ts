import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import {
  Dicebear,
  LayoutApi,
  BreadcrumbsGlobal,
  Icon,
  ColorSchemeLightDirective,
  ColorSchemeDarkDirective,
  ColorSchemeSwitcher,
  PopoverTriggerForDirective,
} from '@ng-mf/components';
import { AuthService, AuthStore } from '@samba/user-domain';
import { NotificationsPopover } from '../../_components/notifications-popover/notifications-popover';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatDivider,
    MatTooltip,
    RouterLink,
    Dicebear,
    BreadcrumbsGlobal,
    Icon,
    ColorSchemeDarkDirective,
    ColorSchemeLightDirective,
    ColorSchemeSwitcher,
    PopoverTriggerForDirective,
    NotificationsPopover
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'block w-full',
  },
})
export class Header {
  private layoutApi = inject(LayoutApi);
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  user = this.authStore.user;

  sidebarShown = computed(() => {
    return this.layoutApi.isSidebarShown('root');
  });

  toggleSidebar(): void {
    if (this.sidebarShown()) {
      this.layoutApi.hideSidebar('root');
    } else {
      this.layoutApi.showSidebar('root');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
