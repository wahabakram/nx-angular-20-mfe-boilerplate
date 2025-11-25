import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { PanelBody, Panel, PanelSidebar } from '@ng-mf/components';
import { OverlayScrollbar } from '@ng-mf/components';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { Navigation, NavigationItem } from '@ng-mf/components';

@Component({
  imports: [
    RouterOutlet,
    Panel,
    PanelSidebar,
    PanelBody,
    OverlayScrollbar,
    Navigation,
    NavigationItem,
    RouterLink
  ],
  templateUrl: './common.html',
  styleUrl: './common.scss'
})
export class Common {
  router = inject(Router);
  location = inject(Location);
  activeLinkId = signal<string | null>(null);
  navItems = signal([
    {
      name: 'General',
      routerLink: '/cards/general'
    },
    {
      name: 'Users',
      routerLink: '/cards/users'
    },
  ]);

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
    const activeLink = this.navItems().find(
      navItem => navItem.routerLink === this.location.path()
    );

    if (activeLink) {
      this.activeLinkId.set(activeLink.routerLink);
    } else {
      this.activeLinkId.set(null);
    }
  }
}
