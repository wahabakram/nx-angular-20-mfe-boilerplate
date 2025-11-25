import { Component, inject, input } from '@angular/core';
import { TabPanelApiService } from '../tab-panel-api';
import { TabPanelNav } from '../tab-panel-nav/tab-panel-nav';
import { TAB_PANEL_NAV } from '../types';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'mf-tab-panel-item',
  exportAs: 'mfTabPanelItem',
  templateUrl: './tab-panel-item.html',
  styleUrl: './tab-panel-item.scss',
  hostDirectives: [MatRipple],
  host: {
    class: 'mf-tab-panel-item',
    '[class.is-active]': 'api.isActive(this.for())',
    '(click)': '_handleClick()',
  },
})
export class TabPanelItem {
  readonly api = inject(TabPanelApiService);
  private _nav = inject<TabPanelNav>(TAB_PANEL_NAV, { optional: true });

  for = input<any>(this._nav ? this._nav.nextId++ : null);

  protected _handleClick() {
    if (!this.for()) {
      return;
    }

    this.api.activate(this.for());
  }
}
