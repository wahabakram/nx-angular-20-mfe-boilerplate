import { Directive } from '@angular/core';

@Directive({
  selector: '[mfSidebarCompactViewMode]',
  exportAs: 'mfSidebarCompactViewMode',
  host: {
    'class': 'mf-sidebar-compact-view-mode',
  }
})
export class SidebarCompactViewModeDirective {
}
