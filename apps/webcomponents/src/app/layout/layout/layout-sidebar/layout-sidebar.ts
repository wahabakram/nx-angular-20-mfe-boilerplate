import { Component, computed, inject } from '@angular/core';
import { LAYOUT } from '../types';
import { LayoutComponent } from '../layout/layout';
import { LayoutSidebarStore } from '../layout-store';

@Component({
  selector: 'mfc-layout-sidebar',
  exportAs: 'mfcLayoutSidebar',
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
  host: {
    'class': 'mfc-layout-sidebar',
    '[class.is-hidden]': '!_isShown()'
  }
})
export class LayoutSidebar {
  private _parent = inject<LayoutComponent>(LAYOUT);
  private _layoutSidebarStore = inject<any>(LayoutSidebarStore);

  protected _isShown = computed<boolean>(() => {
    if (this._parent.layoutId() in this._layoutSidebarStore) {
      return this._layoutSidebarStore[this._parent.layoutId()]();
    }

    return true;
  });
}
