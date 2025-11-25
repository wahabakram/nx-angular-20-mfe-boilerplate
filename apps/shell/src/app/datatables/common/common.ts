import { Component, inject } from '@angular/core';
import {
  PanelBody,
  Panel, PanelSidebar,
} from '@ng-mf/components';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { Navigation, NavigationItem } from '@ng-mf/components';
import { Container } from '@/_partials/container/container';

interface NavItem {
  name: string;
  link: string;
}

@Component({
  imports: [
    Panel,
    PanelBody,
    RouterOutlet,
    Navigation,
    NavigationItem,
    RouterLink,
    PanelSidebar,
    Container
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
      link: '/datatables/general'
    },
    {
      name: 'Users',
      link: '/datatables/users'
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
