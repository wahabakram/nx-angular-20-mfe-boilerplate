import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNavigationGroupToggleIcon]',
  exportAs: 'mfNavigationGroupToggleIcon',
  host: {
    'class': 'mf-navigation-group-toggle-icon'
  }
})
export class NavigationGroupToggleIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
