import {
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { SIDEBAR_NAVIGATION } from '../types';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';
import { SidebarNavStore } from '../sidebar.store';

export class SidebarNavItemInterface {
  active: boolean;
}

@Component({
  selector: 'mf-sidebar-nav-item,[mf-sidebar-nav-item]',
  exportAs: 'mf-sidebar-nav-item',
  imports: [MatRipple],
  templateUrl: './sidebar-nav-item.html',
  styleUrl: './sidebar-nav-item.scss',
  host: {
    class: 'mf-sidebar-nav-item',
    '[class.is-active]': 'forceActive() || active',
    '(click)': 'click($event)',
  },
})
export class SidebarNavItem implements SidebarNavItemInterface {
  private _navigation = inject<SidebarNav>(SIDEBAR_NAVIGATION);
  private _elementRef = inject(ElementRef);
  private _navStore = inject(SidebarNavStore);

  get api() {
    return {
      isActive: () => this.active,
    };
  }

  key = input<any>(Math.random());
  forceActive = input(false, {
    transform: booleanAttribute,
  });

  click(event: MouseEvent) {
    if (!this.key()) {
      return;
    }

    this._navStore.setItemActiveKey(this.key());
    this._navigation.itemClicked.emit(this.key());
  }

  get active(): boolean {
    return this._navStore.isItemActive(this.key());
  }

  get _hostElement(): ElementRef {
    return this._elementRef;
  }
}

// Export alias for backward compatibility
export { SidebarNavItem as SidebarNavItemComponent };
