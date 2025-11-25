import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNavigationItemIcon]',
  exportAs: 'mfNavigationItemIcon',
  host: {
    'class': 'mf-navigation-item-icon'
  }
})
export class NavigationItemIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
