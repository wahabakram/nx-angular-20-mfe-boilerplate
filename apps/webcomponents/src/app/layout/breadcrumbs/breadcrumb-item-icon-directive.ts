import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcBreadcrumbItemIcon]',
  exportAs: 'mfcBreadcrumbItemIcon',
  host: {
    'class': 'mfc-breadcrumb-item-icon'
  }
})
export class BreadcrumbItemIconDirective {
}
