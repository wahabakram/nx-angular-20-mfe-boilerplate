import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../../../icon/icon';

export interface MenuItem {
  path: string;
  icon: string;
  label: string;
  badge?: string;
  subItems?: MenuItem[];
  permissions?: string[];
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

export interface BusinessSidebarConfig {
  brandName?: string;
  brandSubtitle?: string;
  brandIcon?: string;
  showWorkspaceSelector?: boolean;
  showUserProfile?: boolean;
  compactMode?: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
}

@Component({
  selector: 'mfc-business-sidebar',
  imports: [CommonModule, Icon, RouterLink, RouterLinkActive],
  templateUrl: './business-sidebar.html',
  styleUrl: './business-sidebar.scss'
})
export class BusinessSidebar {
  // Inputs
  config = input<BusinessSidebarConfig>({});
  menuItems = input<MenuItem[]>([]);
  workspaces = input<Workspace[]>([]);
  currentUser = input<User | null>(null);
  selectedWorkspace = input<Workspace | null>(null);

  // Outputs
  workspaceSelected = output<Workspace>();
  logout = output<void>();
  createWorkspace = output<void>();

  // Internal state
  expandedItems = signal<Set<string>>(new Set());

  // Computed properties
  defaultConfig = computed(() => ({
    brandName: 'Business ERP',
    brandSubtitle: 'Management System',
    brandIcon: 'B',
    showWorkspaceSelector: true,
    showUserProfile: true,
    compactMode: false,
    ...this.config()
  }));

  userInitials = computed(() => {
    const user = this.currentUser();
    if (user) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return this.defaultConfig().brandIcon;
  });

  sidebarClasses = computed(() => {
    const config = this.defaultConfig();
    const classes = [
      'menu',
      'menu-md',
      'p-4',
      'bg-base-100',
      'text-base-content',
      'h-screen',
      'flex',
      'flex-col'
    ];

    if (config.compactMode) {
      classes.push('w-20');
    } else {
      classes.push('w-72');
    }

    return classes.join(' ');
  });

  toggleExpanded(path: string): void {
    const expanded = this.expandedItems();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }

    this.expandedItems.set(newExpanded);
  }

  isExpanded(path: string): boolean {
    return this.expandedItems().has(path);
  }

  onWorkspaceSelected(workspace: Workspace): void {
    this.workspaceSelected.emit(workspace);
    // Close the dropdown after selection by removing focus
    (document.activeElement as HTMLElement)?.blur();
  }

  onCreateWorkspace(): void {
    this.createWorkspace.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  hasSubItems(item: MenuItem): boolean {
    return !!(item.subItems && item.subItems.length > 0);
  }

  trackByMenuItem(_index: number, item: MenuItem): string {
    return item.path;
  }

  trackByWorkspace(_index: number, workspace: Workspace): string {
    return workspace.id;
  }
}