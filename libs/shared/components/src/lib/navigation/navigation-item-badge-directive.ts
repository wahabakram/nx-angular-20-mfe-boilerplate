import { Directive } from '@angular/core';

@Directive({
  selector: '[mfNavigationItemBadge]',
  exportAs: 'mfNavigationItemBadge',
  host: {
    'class': 'mf-navigation-item-badge',
  }
})
export class NavigationItemBadgeDirective {
}
