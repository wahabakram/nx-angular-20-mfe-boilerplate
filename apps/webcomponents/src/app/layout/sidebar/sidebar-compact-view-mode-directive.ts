import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcSidebarCompactViewMode]',
  exportAs: 'mfcSidebarCompactViewMode',
  host: {
    'class': 'mfc-sidebar-compact-view-mode',
  }
})
export class SidebarCompactViewModeDirective {
}
