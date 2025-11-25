import {
  AfterContentInit,
  Component,
  inject,
  contentChildren,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NavigationItem } from '../navigation-item/navigation-item';
import { NAVIGATION_GROUP } from '../types';
import { NavigationGroup } from '../navigation-group/navigation-group';
import { NavigationStore } from '../navigation.store';

@Component({
  selector: 'mf-navigation-group-menu',
  exportAs: 'mfNavigationGroupMenu',
  templateUrl: './navigation-group-menu.html',
  styleUrl: './navigation-group-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mf-navigation-group-menu',
    '[class.is-active]': 'active()',
  },
})
export class NavigationGroupMenu implements AfterContentInit {
  private store = inject(NavigationStore);
  private _group = inject<NavigationGroup>(NAVIGATION_GROUP);

  readonly active = computed(() => {
    return this.store.activeGroupKey() === this._group.key();
  });
  readonly _items = contentChildren(NavigationItem, { descendants: true });
  readonly hasActiveItemInGroup = computed(() => {
    return (
      this._items().filter(
        (itemComponent) => this.store.activeKey() === itemComponent.key()
      ).length > 0
    );
  });

  ngAfterContentInit() {
    this._detectGroupIsActive();
  }

  private _detectGroupIsActive() {
    if (this.hasActiveItemInGroup() && !this.active()) {
      this.store.setActiveGroupKey(this._group.key());
    } else {
      if (this.store.activeGroupKey() === this._group.key()) {
        this.store.setActiveGroupKey(null);
      } else {
        this.store.setActiveGroupKey(this._group.key());
      }
    }
  }
}
