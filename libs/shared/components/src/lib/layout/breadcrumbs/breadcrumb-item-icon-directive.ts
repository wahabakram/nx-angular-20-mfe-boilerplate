import { Directive } from '@angular/core';

@Directive({
  selector: '[mfBreadcrumbItemIcon]',
  exportAs: 'mfBreadcrumbItemIcon',
  host: {
    'class': 'mf-breadcrumb-item-icon'
  }
})
export class BreadcrumbItemIconDirective {
}
