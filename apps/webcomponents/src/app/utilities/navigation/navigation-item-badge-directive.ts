import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcNavigationItemBadge]',
  exportAs: 'mfcNavigationItemBadge',
  host: {
    'class': 'mfc-navigation-item-badge',
  }
})
export class NavigationItemBadgeDirective {
}
