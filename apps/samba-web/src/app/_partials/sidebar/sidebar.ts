import { Component, computed, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  SidebarNavGroupToggleIconDirective,
  Logo,
  Icon,
  Dicebear,
} from '@ng-mf/components';
import { AuthApi, AuthStore } from '@samba/user-domain';

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
    SidebarNavGroupToggleIconDirective,
    Logo,
    Icon,
    Dicebear,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private authApi = inject(AuthApi);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  compact = signal(false);
  activeKey = signal('');
  user = this.authStore.user;

  private allNavItems: NavItem[] = [
    {
      type: 'heading',
      key: 'dashboard-heading',
      name: 'Dashboard',
    },
    {
      type: 'link',
      key: 'dashboard',
      name: 'Dashboard',
      icon: 'solar:widget-2-outline',
      link: '/dashboard',
      roles: ['admin', 'manager', 'cashier'],
    },
    // Inventory Management Group
    {
      type: 'heading',
      key: 'inventory-heading',
      name: 'Inventory Management',
    },
    {
      type: 'link',
      key: 'products',
      name: 'Products',
      icon: 'solar:box-outline',
      link: '/products',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'inventory',
      name: 'Stock Levels',
      icon: 'solar:clipboard-list-outline',
      link: '/inventory',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'stock-transfers',
      name: 'Transfers',
      icon: 'solar:transfer-horizontal-outline',
      link: '/stock-transfers',
      roles: ['admin', 'manager'],
    },
    // Sales Group
    {
      type: 'heading',
      key: 'sales-heading',
      name: 'Sales',
    },
    {
      type: 'link',
      key: 'pos',
      name: 'Point of Sale',
      icon: 'solar:calculator-outline',
      link: '/pos',
      roles: ['admin', 'manager', 'cashier'],
    },
    {
      type: 'link',
      key: 'sales-history',
      name: 'Sales History',
      icon: 'solar:history-outline',
      link: '/sales',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'quotations',
      name: 'Quotations',
      icon: 'solar:document-text-outline',
      link: '/sales/quotations',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'returns',
      name: 'Customer Returns',
      icon: 'solar:undo-left-outline',
      link: '/sales/returns',
      roles: ['admin', 'manager'],
    },

    // Customers (standalone)
    {
      type: 'heading',
      key: 'customers-heading',
      name: 'Customers',
    },
    {
      type: 'link',
      key: 'customers',
      name: 'Customers',
      icon: 'solar:users-group-rounded-outline',
      link: '/customers',
      roles: ['admin', 'manager'],
    },

    // Procurement Group
    {
      type: 'heading',
      key: 'procurement-heading',
      name: 'Procurement',
    },
    {
      type: 'link',
      key: 'suppliers',
      name: 'Suppliers',
      icon: 'solar:shop-2-outline',
      link: '/suppliers',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'purchases',
      name: 'Purchases',
      icon: 'solar:cart-large-2-outline',
      link: '/purchases',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'purchase-returns',
      name: 'Purchase Returns',
      icon: 'solar:undo-left-outline',
      link: '/purchases/returns',
      roles: ['admin', 'manager'],
    },
    // Reports Group
    {
      type: 'heading',
      key: 'reports-heading',
      name: 'Reports',
    },
    {
      type: 'link',
      key: 'reports-sales',
      name: 'Sales Report',
      icon: 'solar:chart-outline',
      link: '/reports/sales',
      roles: ['admin', 'manager'],
    },
    {
      type: 'link',
      key: 'reports-inventory',
      name: 'Inventory Report',
      icon: 'solar:pie-chart-outline',
      link: '/reports/inventory',
      roles: ['admin', 'manager'],
    },
    // Settings Group
    {
      type: 'heading',
      key: 'settings-heading',
      name: 'Settings',
    },
    {
      type: 'link',
      key: 'users',
      name: 'Users',
      icon: 'solar:user-outline',
      link: '/settings/users',
      roles: ['admin'],
    },
    {
      type: 'link',
      key: 'branches',
      name: 'Branches',
      icon: 'solar:home-outline',
      link: '/settings/branches',
      roles: ['admin'],
    },
    {
      type: 'link',
      key: 'categories',
      name: 'Categories',
      icon: 'solar:folder-outline',
      link: '/settings/categories',
      roles: ['admin'],
    },
  ];

  // Filter navigation items based on user role
  visibleNavItems = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];

    const filterItems = (items: NavItem[]): NavItem[] => {
      return items
        .filter((item) => {
          if (!item.roles) return true;
          return item.roles.includes(currentUser.role);
        })
        .map((item) => {
          // If item has children, filter them recursively
          if (item.children) {
            return {
              ...item,
              children: filterItems(item.children),
            };
          }
          return item;
        })
        .filter((item) => {
          // Remove groups that have no visible children
          if (item.type === 'group' && item.children) {
            return item.children.length > 0;
          }
          return true;
        });
    };

    return filterItems(this.allNavItems);
  });

  constructor() {
    // Track active route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveKey();
      });

    // Set initial active key
    this.updateActiveKey();
  }

  private updateActiveKey(): void {
    const currentUrl = this.router.url;

    // Check all items including children
    const findMatchedItem = (items: NavItem[]): NavItem | undefined => {
      for (const item of items) {
        // Check if current item matches
        if (item.link && currentUrl.startsWith(item.link)) {
          return item;
        }

        // Check children if it's a group
        if (item.children) {
          const matchedChild = findMatchedItem(item.children);
          if (matchedChild) {
            return matchedChild;
          }
        }
      }
      return undefined;
    };

    const matchedItem = findMatchedItem(this.allNavItems);
    if (matchedItem) {
      this.activeKey.set(matchedItem.key);
    }
  }

  toggleCompact(): void {
    this.compact.update((value) => !value);
  }

  logout(): void {
    this.authApi.logout();
    this.router.navigate(['/auth/login']);
  }
}
