import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNavigationGroupToggleIcon]',
  exportAs: 'mfcNavigationGroupToggleIcon',
  host: {
    'class': 'mfc-navigation-group-toggle-icon'
  }
})
export class NavigationGroupToggleIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
