import { Component, inject, input } from '@angular/core';
import { v7 as uuid } from 'uuid';
import { RAIL_NAV, RailNavComponent } from '../types';

@Component({
  selector: 'mfc-rail-nav-item,[mfc-rail-nav-item]',
  exportAs: 'mfcRailNavItem',
  templateUrl: './rail-nav-item.html',
  styleUrl: './rail-nav-item.scss',
  host: {
    'class': 'mfc-rail-nav-item',
    '[class.is-active]': 'isActive',
    '(click)': 'click($event)'
  }
})
export class RailNavItem {
  protected _railNav = inject<RailNavComponent>(RAIL_NAV);

  key = input(uuid());

  get isActive(): boolean {
    if (!this.key() || !this._railNav.api.getActiveKey()) {
      return false;
    }

    return this._railNav.api.isActive(this.key());
  }

  click(event: MouseEvent) {
    if (!this.key()) {
      return;
    }

    this._railNav.api.activateItem(this.key());
  }
}
