import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { SidebarNavStore } from '../sidebar.store';

@Component({
  selector: 'mfc-sidebar-nav-group-toggle',
  exportAs: 'mfcSidebarNavGroupToggle',
  templateUrl: './sidebar-nav-group-toggle.html',
  styleUrl: './sidebar-nav-group-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    MatRipple
  ],
  host: {
    'class': 'mfc-sidebar-nav-group-toggle',
    '[class.is-active]': 'active',
    '(click)': 'toggle($event)'
  }
})
export class SidebarNavGroupToggle {
  private _navStore = inject(SidebarNavStore);

  readonly for = signal<any>(null);

  get active(): boolean {
    if (!this.for()) {
      return false;
    }

    return this._navStore.isGroupActive(this.for());
  }

  toggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this._navStore.isGroupActive(this.for())) {
      this._navStore.setGroupActiveKey(null);
    } else {
      this._navStore.setGroupActiveKey(this.for());
    }
  }
}

// Export alias for backward compatibility
export { SidebarNavGroupToggle as SidebarNavGroupToggleComponent };
