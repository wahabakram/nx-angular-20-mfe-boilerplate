import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject, OnInit,
  signal,
} from '@angular/core';
import { SIDEBAR_NAVIGATION, SIDEBAR_NAVIGATION_GROUP } from '../types';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav';
import { SidebarNavGroupComponent } from '../sidebar-nav-group/sidebar-nav-group';
import { SidebarNavItemComponent } from '../sidebar-nav-item/sidebar-nav-item';
import { SidebarNavStore } from '../sidebar.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'mf-sidebar-nav-group-menu',
  exportAs: 'mfSidebarNavGroupMenu',
  templateUrl: './sidebar-nav-group-menu.html',
  styleUrl: './sidebar-nav-group-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mf-sidebar-nav-group-menu',
    '[class.is-active]': 'active'
  }
})
export class SidebarNavGroupMenu implements AfterContentInit, OnInit {
  readonly navigation = inject<SidebarNavComponent>(SIDEBAR_NAVIGATION);
  private _group = inject<SidebarNavGroupComponent>(SIDEBAR_NAVIGATION_GROUP);
  private _navStore = inject(SidebarNavStore);

  readonly _items = contentChildren(SidebarNavItemComponent, { descendants: true });

  key = signal<any>(this._group._groupId);

  get active(): boolean {
    return this._navStore.isGroupActive(this.key());
  }

  ngOnInit() {
    this.navigation
      .itemClicked
      .subscribe(() => {
        const isGroupActive = this._items().filter(
          itemComponent => itemComponent.active
        ).length > 0;

        if (!isGroupActive && this._group._groupId === this._navStore.activeGroupKey()) {
          this._navStore.setGroupActiveKey(null);
        }
      });
  }

  ngAfterContentInit() {
    this._checkIfActive();
  }

  hasActiveItem(): boolean {
    return this._items().filter(
      itemComponent => itemComponent.active
    ).length > 0;
  }

  private _checkIfActive() {
    const isGroupActive = this._items().filter(
      itemComponent => itemComponent.active
    ).length > 0;

    if (isGroupActive) {
      this._navStore.setGroupActiveKey(this.key());
    }
  }
}

// Export alias for backward compatibility
export { SidebarNavGroupMenu as SidebarNavGroupMenuComponent };
