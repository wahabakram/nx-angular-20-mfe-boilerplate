import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcDrawerIgnoreOutsideClick]',
  host: {
    'class': 'mfc-drawer-ignore-outside-click'
  }
})
export class DrawerIgnoreOutsideClickDirective {
}
