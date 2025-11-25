import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Navigation, NavigationItem } from '@ng-mf/components';
import {
  PanelBody,
  Panel,
  PanelSidebar
} from '@ng-mf/components';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { NavItem } from '@/account/settings/common/common';
import { OverlayScrollbar } from '@ng-mf/components';

@Component({
  imports: [
    RouterOutlet,
    Navigation,
    NavigationItem,
    PanelBody,
    Panel,
    RouterLink,
    PanelSidebar,
    OverlayScrollbar
  ],
  templateUrl: './common.html',
  styleUrl: './common.scss'
})
export class Common {
  router = inject(Router);
  location = inject(Location);
  activeLinkId!: string | null;
  navItems: NavItem[] = [
    {
      name: 'General',
      link: '/widgets/general'
    },
    {
      name: 'Finance',
      link: '/widgets/finance'
    },
    {
      name: 'Analytics',
      link: '/widgets/analytics'
    },
    {
      name: 'Crypto',
      link: '/widgets/crypto'
    },
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
