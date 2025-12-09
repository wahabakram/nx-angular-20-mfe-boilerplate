import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  Sidebar as MfSidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavGroupMenu,
  SidebarNavGroupToggle,
  SidebarNavHeading,
  SidebarNavItem,
  SidebarCompactViewModeDirective,
  SidebarFullViewModeDirective,
  SidebarNavItemIconDirective,
  SidebarNavItemBadgeDirective,
  SidebarNavGroupToggleIconDirective,
  Logo,
  Icon,
  Dicebear
} from '@ng-mf/components';
import { AuthService, AuthStore } from '@samba/user-domain';

interface NavItem {
  type: 'link' | 'heading' | 'group';
  key: string;
  name: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
  roles?: string[]; // Which roles can see this item
}

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip,
    RouterLink,
    MfSidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarNav,
    SidebarNavGroup,
    SidebarNavGroupMenu,
    SidebarNavGroupToggle,
    SidebarNavHeading,
    SidebarNavItem,
    SidebarCompactViewModeDirective,
    SidebarFullViewModeDirective,
    SidebarNavItemIconDirective,
    SidebarNavItemBadgeDirective,
    SidebarNavGroupToggleIconDirective,
    Logo,
    Icon,
    Dicebear
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  compact = signal(false);
  activeKey = signal('');
  user = this.authStore.user;

  private allNavItems: NavItem[] = [
    {
      type: 'link',
      key: 'dashboard',
      name: 'Dashboard',
      icon: 'solar:widget-2-outline',
      link: '/dashboard',
      roles: ['admin', 'manager', 'cashier']
    },
    {
      type: 'heading',
      key: 'management',
      name: 'Management',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'products',
      name: 'Products',
      icon: 'solar:box-outline',
      link: '/products',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'inventory',
      name: 'Inventory',
      icon: 'solar:clipboard-list-outline',
      link: '/inventory',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'stock-transfers',
      name: 'Stock Transfers',
      icon: 'solar:transfer-horizontal-outline',
      link: '/stock-transfers',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'customers',
      name: 'Customers',
      icon: 'solar:users-group-rounded-outline',
      link: '/customers',
      roles: ['admin', 'manager']
    },
    {
      type: 'heading',
      key: 'sales',
      name: 'Sales',
      roles: ['admin', 'manager', 'cashier']
    },
    {
      type: 'link',
      key: 'pos',
      name: 'Point of Sale',
      icon: 'solar:calculator-outline',
      link: '/pos',
      roles: ['admin', 'manager', 'cashier']
    },
    {
      type: 'link',
      key: 'sales-history',
      name: 'Sales History',
      icon: 'solar:history-outline',
      link: '/sales',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'quotations',
      name: 'Quotations',
      icon: 'solar:document-text-outline',
      link: '/sales/quotations',
      roles: ['admin', 'manager']
    },
    {
      type: 'heading',
      key: 'reports',
      name: 'Reports',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'reports-sales',
      name: 'Sales Report',
      icon: 'solar:chart-outline',
      link: '/reports/sales',
      roles: ['admin', 'manager']
    },
    {
      type: 'link',
      key: 'reports-inventory',
      name: 'Inventory Report',
      icon: 'solar:pie-chart-outline',
      link: '/reports/inventory',
      roles: ['admin', 'manager']
    },
    {
      type: 'heading',
      key: 'settings',
      name: 'Settings',
      roles: ['admin']
    },
    {
      type: 'link',
      key: 'users',
      name: 'Users',
      icon: 'solar:user-outline',
      link: '/settings/users',
      roles: ['admin']
    },
    {
      type: 'link',
      key: 'branches',
      name: 'Branches',
      icon: 'solar:home-outline',
      link: '/settings/branches',
      roles: ['admin']
    },
    {
      type: 'link',
      key: 'categories',
      name: 'Categories',
      icon: 'solar:folder-outline',
      link: '/settings/categories',
      roles: ['admin']
    }
  ];

  // Filter navigation items based on user role
  visibleNavItems = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];

    return this.allNavItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(currentUser.role);
    });
  });

  constructor() {
    // Track active route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveKey();
      });

    // Set initial active key
    this.updateActiveKey();
  }

  private updateActiveKey(): void {
    const currentUrl = this.router.url;
    const matchedItem = this.allNavItems.find(item => {
      if (item.link) {
        return currentUrl.startsWith(item.link);
      }
      return false;
    });
    if (matchedItem) {
      this.activeKey.set(matchedItem.key);
    }
  }

  toggleCompact(): void {
    this.compact.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
