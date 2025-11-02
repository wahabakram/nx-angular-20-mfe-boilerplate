import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNavigationItemIcon]',
  exportAs: 'mfcNavigationItemIcon',
  host: {
    'class': 'mfc-navigation-item-icon'
  }
})
export class NavigationItemIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
