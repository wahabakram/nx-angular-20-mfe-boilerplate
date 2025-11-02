import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcSidebarFullViewMode]',
  exportAs: 'mfcSidebarFullViewMode',
  host: {
    'class': 'mfc-sidebar-full-view-mode',
  }
})
export class SidebarFullViewModeDirective {

}
