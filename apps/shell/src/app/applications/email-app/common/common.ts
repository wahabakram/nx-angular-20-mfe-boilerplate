import { Component, inject, OnInit, signal } from '@angular/core';
import { Container } from '@/_partials/container/container';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  Navigation,
  NavigationItemBadgeDirective,
  NavigationItem,
  NavigationItemIconDirective,
} from '@ng-mf/components';
import { PanelBody, Panel, PanelHeader, PanelSidebar } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { OverlayScrollbar } from '@ng-mf/components';

interface MailNavigationItem {
  id: string;
  name: string;
  icon?: string;
  routerLink: string;
  emailsCount?: number;
  badgeTextOnly?: boolean;
}

@Component({
  imports: [
    Container,
    MatButton,
    MatIcon,
    MatIconButton,
    Navigation,
    NavigationItem,
    NavigationItemIconDirective,
    PanelBody,
    Panel,
    PanelSidebar,
    RouterOutlet,
    RouterLink,
    PanelHeader,
    OverlayScrollbar,
    NavigationItemBadgeDirective,
  ],
  templateUrl: './common.html',
  styleUrl: './common.scss',
})
export class Common implements OnInit {
  private router = inject(Router);
  private location = inject(Location);

  readonly activeLinkId = signal<string | null>(null);
  readonly navigation = signal<MailNavigationItem[]>([
    {
      id: 'inbox',
      name: 'Inbox',
      icon: 'inbox',
      routerLink: '/applications/email-app/inbox',
      emailsCount: 2183,
    },
    {
      id: 'sent',
      name: 'Sent',
      icon: 'outgoing_mail',
      routerLink: '/applications/email-app/sent',
    },
    {
      id: 'drafts',
      name: 'Drafts',
      icon: 'drafts',
      routerLink: '/applications/email-app/drafts',
      emailsCount: 9,
      badgeTextOnly: true,
    },
    {
      id: 'spam',
      name: 'Spam',
      icon: 'warning',
      routerLink: '/applications/email-app/spam',
    },
    {
      id: 'trash',
      name: 'Trash',
      icon: 'delete',
      routerLink: '/applications/email-app/trash',
    },
  ]);
  readonly allLabels = signal<MailNavigationItem[]>([
    {
      id: 'personal',
      name: 'Personal',
      routerLink: '/applications/email-app/label/personal',
    },
    {
      id: 'work',
      name: 'Work',
      routerLink: '/applications/email-app/label/work',
    },
    {
      id: 'travel',
      name: 'Travel',
      routerLink: '/applications/email-app/label/travel',
    },
    {
      id: 'social',
      name: 'Social',
      routerLink: '/applications/email-app/label/social',
    },
    {
      id: 'family',
      name: 'Family',
      routerLink: '/applications/email-app/label/family',
    },
  ]);

  // protected readonly isMobile = signal(false);
  // protected readonly opened = signal(true);
  //
  // private readonly _mobileQuery: MediaQueryList;
  // private readonly _mobileQueryListener: () => void;
  //
  // constructor() {
  //   const media = inject(MediaMatcher);
  //   this._mobileQuery = media.matchMedia('(max-width: 600px)');
  //   this.isMobile.set(this._mobileQuery.matches);
  //   this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
  //   this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  // }
  //
  // ngOnDestroy(): void {
  //   this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  // }

  ngOnInit() {
    this._activateLink();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this._activateLink();
      });
  }

  addNewLabel() {}

  editLabel(label: any) {}

  private _activateLink() {
    const activeLink = [...this.navigation(), ...this.allLabels()].find(
      (navItem) => {
        if (navItem.routerLink === this.location.path()) {
          return true;
        }

        return (
          (this.location.path() !== '/' || this.location.path() !== '') &&
          this.location.path().includes(navItem.routerLink as string)
        );
      }
    );

    if (activeLink) {
      this.activeLinkId.set(activeLink.id);
    } else {
      this.activeLinkId.set(null);
    }
  }
}
