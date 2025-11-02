import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  forwardRef,
} from '@angular/core';
import { SidebarNavGroupToggleComponent } from '../sidebar-nav-group-toggle/sidebar-nav-group-toggle';
import { SIDEBAR_NAVIGATION_GROUP } from '../types';
import { SidebarNavGroupMenuComponent } from '../sidebar-nav-group-menu/sidebar-nav-group-menu';

let nextId = 0;

@Component({
  selector: 'mfc-sidebar-nav-group',
  templateUrl: './sidebar-nav-group.html',
  styleUrl: './sidebar-nav-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: SIDEBAR_NAVIGATION_GROUP,
      useExisting: forwardRef(() => SidebarNavGroup),
    }
  ]
})
export class SidebarNavGroup implements AfterContentInit {
  private _toggle = contentChild.required(SidebarNavGroupToggleComponent, {
    descendants: false,
  });
  private _menu = contentChild.required(SidebarNavGroupMenuComponent, {
    descendants: false,
  });
  readonly _groupId = `sidebar-nav-group-${nextId++}`;

  ngAfterContentInit() {
    this._toggle().for.set(this._groupId);
  }

  hasActiveItem(): boolean {
    return this._menu().hasActiveItem();
  }
}

// Export alias for backward compatibility
export { SidebarNavGroup as SidebarNavGroupComponent };
