import { Component, input, output, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../icon/icon';
import { SearchBar, SearchSuggestion } from '../../../search-bar/search-bar';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ThemeService {
  currentTheme: () => string;
  currentThemeInfo: () => {
    name: string;
    displayName: string;
    isDark: boolean;
    category: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      background: string;
    };
  };
  lightThemes: () => Array<{
    name: string;
    displayName: string;
    isDark: boolean;
    category: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      background: string;
    };
  }>;
  darkThemes: () => Array<{
    name: string;
    displayName: string;
    isDark: boolean;
    category: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      background: string;
    };
  }>;
  colorfulThemes: () => Array<{
    name: string;
    displayName: string;
    isDark: boolean;
    category: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      background: string;
    };
  }>;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

@Component({
  selector: 'mf-header',
  imports: [Icon, CommonModule, SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);

  // Theme service input (injected from parent)
  themeService = input<ThemeService | null>(null);

  // Global search inputs
  searchValue = input<string>('');
  searchSuggestions = input<SearchSuggestion[]>([]);
  searchPlaceholder = input<string>('Search...');
  showSearch = input<boolean>(true);

  // Global search outputs
  searchQueryChange = output<string>();
  searchSuggestionSelected = output<SearchSuggestion>();

  drawerOpen = true;

  // Notifications
  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);
  // showNotifications = signal(false);
  // showThemeSelector = signal(false);

  protected drawerToggle = output<boolean>();

  constructor() {
    this.loadNotifications();
  }

  toggleTheme() {
    const service = this.themeService();
    if (service) {
      service.toggleTheme();
    }
  }

  // toggleThemeSelector() {
  //   this.showThemeSelector.update(show => !show);
  // }

  selectTheme(themeName: string) {
    const service = this.themeService();
    if (service) {
      service.setTheme(themeName);
    }
    // this.showThemeSelector.set(false);
  }

  getCurrentTheme(): string {
    return this.themeService()?.currentTheme() || 'cupcake';
  }

  getCurrentThemeDisplay(): string {
    return this.themeService()?.currentThemeInfo().displayName || 'Cupcake';
  }

  getLightThemes() {
    return this.themeService()?.lightThemes() || [];
  }

  getDarkThemes() {
    return this.themeService()?.darkThemes() || [];
  }

  getColorfulThemes() {
    return this.themeService()?.colorfulThemes() || [];
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
    this.drawerToggle.emit(this.drawerOpen);
  }

  // toggleNotifications() {
  //   this.showNotifications.set(!this.showNotifications());
  // }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // In a real app, this would clear authentication tokens and redirect to login
      console.log('Logging out...');
      // For demo purposes, just show an alert
      alert('Logout functionality would be implemented here');
    }
  }

  markNotificationAsRead(notification: Notification) {
    const notifications = this.notifications();
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    this.notifications.set(updatedNotifications);
    this.updateUnreadCount();

    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
    }
  }

  markAllAsRead() {
    const notifications = this.notifications().map(n => ({ ...n, read: true }));
    this.notifications.set(notifications);
    this.updateUnreadCount();
  }

  clearNotification(notification: Notification) {
    const notifications = this.notifications().filter(n => n.id !== notification.id);
    this.notifications.set(notifications);
    this.updateUnreadCount();
  }

  private loadNotifications() {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Team Member',
        message: 'Sarah Wilson has joined the Engineering team',
        type: 'info',
        timestamp: '2024-12-25T10:30:00Z',
        read: false,
        actionUrl: '/teams'
      },
      {
        id: '2',
        title: 'Report Generated',
        message: 'Monthly Performance Dashboard is ready',
        type: 'success',
        timestamp: '2024-12-25T09:00:00Z',
        read: false,
        actionUrl: '/reports'
      },
      {
        id: '3',
        title: 'Security Alert',
        message: 'New login from unknown device detected',
        type: 'warning',
        timestamp: '2024-12-24T16:45:00Z',
        read: false,
        actionUrl: '/profile'
      },
      {
        id: '4',
        title: 'Form Submission',
        message: 'New form submission received for Contact Form',
        type: 'info',
        timestamp: '2024-12-24T14:20:00Z',
        read: true,
        actionUrl: '/builders'
      },
      {
        id: '5',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will begin at 2:00 AM UTC',
        type: 'warning',
        timestamp: '2024-12-23T12:00:00Z',
        read: true
      }
    ];

    this.notifications.set(mockNotifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unreadCount = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(unreadCount);
  }

  formatNotificationTime(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'solar:check-circle-line-duotone';
      case 'warning': return 'solar:danger-triangle-line-duotone';
      case 'error': return 'solar:close-circle-line-duotone';
      default: return 'solar:info-circle-line-duotone';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  }
}
