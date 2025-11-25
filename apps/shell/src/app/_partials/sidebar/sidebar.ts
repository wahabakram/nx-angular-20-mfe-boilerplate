import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { v7 as uuid } from 'uuid';
import { MatIconButton } from '@angular/material/button';
import {
  SidebarBody,
  SidebarCompactViewModeDirective,
  SidebarFullViewModeDirective,
  SidebarHeader,
  SidebarNav,
  Sidebar as EmrSidebar,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavHeading,
  SidebarNavItemBadgeDirective,
  SidebarNavGroupToggle,
  SidebarNavGroupMenu,
  SidebarNavItemIconDirective,
  SidebarNavGroupToggleIconDirective,
  SidebarFooter,
} from '@ng-mf/components';
import { Logo } from '@ng-mf/components';
import { MatBadge } from '@angular/material/badge';
import { Icon } from '@ng-mf/components';
import { UpgradeProPlanCard } from '@/cards/_cards/upgrade-pro-plan-card/upgrade-pro-plan-card';
import { Dicebear } from '@ng-mf/components';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIcon,
    RouterLink,
    EmrSidebar,
    SidebarBody,
    SidebarCompactViewModeDirective,
    SidebarFullViewModeDirective,
    SidebarHeader,
    SidebarNav,
    MatIconButton,
    Logo,
    SidebarNavGroup,
    SidebarNavItem,
    SidebarNavHeading,
    SidebarNavItemBadgeDirective,
    SidebarNavGroupToggleIconDirective,
    SidebarNavGroupToggle,
    SidebarNavGroupMenu,
    SidebarNavItemIconDirective,
    MatBadge,
    Icon,
    SidebarFooter,
    UpgradeProPlanCard,
    Dicebear,
    MatTooltip,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: {
    class: 'sidebar',
    '[class.compact]': 'compact',
  },
})
export class Sidebar implements OnInit {
  private router = inject(Router);
  private location = inject(Location);

  height: string | null = '200px';
  compact = false;

  navItems: any[] = [
    {
      type: 'heading',
      name: 'Dashboards',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Getting Started',
      link: '/dashboard/getting-started',
      icon: 'solar:info-circle-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Basic',
      link: '/dashboard/basic',
      icon: 'solar:widget-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Analytics',
      link: '/dashboard/analytics',
      icon: 'solar:pie-chart-2-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Ecommerce',
      link: '/dashboard/ecommerce',
      icon: 'solar:shop-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Finance',
      link: '/dashboard/finance',
      icon: 'solar:wallet-money-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Explore',
      link: '/dashboard/explore',
      icon: 'solar:global-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Dynamic',
      link: '/dashboard/dynamic',
      icon: 'solar:widget-4-bold-duotone',
    },
    {
      type: 'heading',
      name: 'Customization',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Themes',
      link: '/themes',
      icon: 'solar:palette-round-bold-duotone',
    },
    {
      type: 'heading',
      name: 'Applications',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'AI Studio',
      link: '/applications/ai-studio',
      icon: 'solar:box-minimalistic-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Contacts',
      link: '/applications/contacts',
      icon: 'solar:users-group-rounded-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Calendar',
      link: '/applications/calendar',
      icon: 'solar:calendar-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Email App',
      link: '/applications/email-app',
      icon: 'solar:mailbox-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Messenger',
      link: '/applications/messenger',
      icon: 'solar:plain-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Content Editor',
      link: '/applications/content-editor',
      icon: 'solar:plain-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'File Manager',
      link: '/applications/file-manager',
      icon: 'solar:zip-file-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Kanban Board',
      link: '/applications/kanban-board',
      icon: 'solar:align-bottom-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Notes',
      link: '/applications/notes',
      icon: 'solar:notes-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Projects',
      link: '/applications/projects',
      icon: 'solar:folder-with-files-bold',
    },
    {
      type: 'group',
      name: 'Invoice',
      icon: 'solar:bill-list-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'List',
          link: '/applications/invoice/list',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Details',
          link: '/applications/invoice/details',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Create New',
          link: '/applications/invoice/new',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Edit Invoice',
          link: '/applications/invoice/edit',
        },
      ],
    },
    {
      type: 'group',
      name: 'Courses',
      icon: 'solar:square-academic-cap-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'List',
          link: '/applications/courses/list',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Details',
          link: '/applications/courses/details',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Create New',
          link: '/applications/courses/course/1/content',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Edit Course',
          link: '/applications/courses/course/1/content',
        },
      ],
    },
    {
      type: 'group',
      name: 'Help Center',
      icon: 'solar:help-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Main',
          link: '/applications/help-center/main',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'FAQ',
          link: '/applications/help-center/faq',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Guides',
          link: '/applications/help-center/guides',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Support',
          link: '/applications/help-center/support',
        },
      ],
    },
    {
      type: 'heading',
      name: 'Prebuilt Components',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Widgets',
      link: '/widgets',
      icon: 'solar:widget-5-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Cards',
      link: '/cards',
      icon: 'solar:three-squares-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Skeleton',
      link: '/prebuilt-components/skeleton',
      icon: 'solar:reorder-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Notifications',
      link: '/prebuilt-components/notifications',
      icon: 'solar:bell-bold-duotone',
    },
    {
      key: uuid(),
      type: 'link',
      name: 'Dialogs',
      link: '/prebuilt-components/dialogs',
      icon: 'solar:screencast-2-bold-duotone',
    },
    {
      type: 'heading',
      name: 'Management',
    },
    {
      key: uuid(),
      type: 'group',
      name: 'Settings',
      icon: 'solar:settings-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'General',
          link: '/management/settings/general',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Writing',
          link: '/management/settings/writing',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Reading',
          link: '/management/settings/reading',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Discussion',
          link: '/management/settings/discussion',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Media',
          link: '/management/settings/media',
        },
      ],
    },
    {
      key: uuid(),
      type: 'group',
      name: 'Posts',
      icon: 'solar:document-text-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'All Posts',
          link: '/management/posts/list',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Add Post',
          link: '/management/posts/new',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Post Details',
          link: '/management/posts/details',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Post Edit',
          link: '/management/posts/edit',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Categories',
          link: '/management/posts/categories',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Topics',
          link: '/management/posts/topics',
        },
      ],
    },
    {
      type: 'heading',
      name: 'Miscellaneous',
    },
    {
      type: 'group',
      name: 'Pages',
      icon: 'solar:pip-2-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Pending Email Activation',
          link: '/service-pages/pending-email-activation',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Integrations',
          link: '/integrations',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Onboarding',
          link: '/onboarding',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Not Found 1 (404)',
          link: '/error/not-found',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Not Found 2 (404)',
          link: '/error/not-found-2',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Server Error 1 (500)',
          link: '/error/internal-server-error',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Server Error 2 (500)',
          link: '/error/internal-server-error-2',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Forbidden (401)',
          link: '/error/forbidden',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Forbidden 2 (401)',
          link: '/error/forbidden-2',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Maintenance',
          link: '/error/maintenance',
        },
      ],
    },
    {
      type: 'group',
      name: 'User',
      icon: 'solar:user-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Notifications',
          link: '/account/notifications',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Account Settings',
          link: '/account/settings',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'User Profile',
          link: '/user-profile/overview',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Talent Profile',
          link: '/user-profile/talent-profile',
        },
      ],
    },
    {
      type: 'group',
      name: 'Pricing',
      icon: 'solar:money-bag-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Basic',
          link: '/pricing/basic',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Membership Plans',
          link: '/pricing/membership-plans',
        },
      ],
    },
    {
      type: 'group',
      name: 'Authentication',
      icon: 'solar:lock-bold-duotone',
      children: [
        {
          key: uuid(),
          type: 'link',
          name: 'Sign In',
          link: '/auth/sign-in',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Sign Up',
          link: '/auth/signup',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Forgot Password',
          link: '/auth/forgot-password',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Password Reset',
          link: '/auth/password-reset',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Set New Password',
          link: '/auth/set-new-password',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Done',
          link: '/auth/done',
        },
        {
          key: uuid(),
          type: 'link',
          name: 'Create Account',
          link: '/auth/create-account',
        },
      ],
    },
  ];
  navItemLinks: any[] = [];
  activeKey: null | string = null;

  ngOnInit() {
    this.navItems.forEach((navItem) => {
      this.navItemLinks.push(navItem);

      if (navItem.children) {
        this.navItemLinks = this.navItemLinks.concat(navItem.children as any[]);
      }
    });
    this._activateLink();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this._activateLink();
      });
  }

  private _activateLink() {
    const activeLink = this.navItemLinks.find((navItem) => {
      if (navItem.link === this.location.path()) {
        return true;
      }

      return (
        (this.location.path() !== '/' || this.location.path() !== '') &&
        this.location.path().includes(navItem.link as string)
      );
    });

    if (activeLink) {
      this.activeKey = activeLink.key;
    } else {
      this.activeKey = null;
    }
  }
}
