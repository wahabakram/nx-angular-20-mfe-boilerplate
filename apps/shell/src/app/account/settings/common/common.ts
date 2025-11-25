import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { Navigation, NavigationItem } from '@ng-mf/components';
import {
  PanelBody,
  Panel,
  PanelSidebar
} from '@ng-mf/components';
import { Container } from '@/_partials/container/container';
import { OverlayScrollbar } from '@ng-mf/components';

export interface NavItem {
  name: string;
  link: string;
}

@Component({
  selector: 'app-common',
  imports: [
    RouterLink,
    RouterOutlet,
    Navigation,
    NavigationItem,
    Panel,
    PanelBody,
    PanelSidebar,
    Container,
    OverlayScrollbar
  ],
  templateUrl: './common.html',
  styleUrl: './common.scss'
})
export class Common implements OnInit {
  router = inject(Router);
  location = inject(Location);
  activeLinkId!: string | null;
  navItems: NavItem[] = [
    {
      name: 'My Profile',
      link: '/account/settings/my-profile'
    },
    {
      name: 'Security',
      link: '/account/settings/security'
    },
    {
      name: 'Notifications',
      link: '/account/settings/notifications'
    },
    {
      name: 'Notifications 2',
      link: '/account/settings/notifications-2'
    },
    {
      name: 'Billing',
      link: '/account/settings/billing'
    },
    {
      name: 'Billing 2',
      link: '/account/settings/billing-2'
    },
    {
      name: 'Payment',
      link: '/account/settings/payment'
    },
    {
      name: 'Cookie',
      link: '/account/settings/cookie'
    },
    {
      name: 'Sessions',
      link: '/account/settings/sessions'
    }
  ];

  ngOnInit() {
    this._activateLink();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this._activateLink();
      })
    ;
  }

  private _activateLink() {
    const activeLink = this.navItems.find(
      navItem => navItem.link === this.location.path()
    );

    if (activeLink) {
      this.activeLinkId = activeLink.link;
    } else {
      this.activeLinkId = null;
    }
  }
}
