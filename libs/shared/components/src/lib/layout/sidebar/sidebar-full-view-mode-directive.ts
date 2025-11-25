import { Directive } from '@angular/core';

@Directive({
  selector: '[mfSidebarFullViewMode]',
  exportAs: 'mfSidebarFullViewMode',
  host: {
    'class': 'mf-sidebar-full-view-mode',
  }
})
export class SidebarFullViewModeDirective {

}
