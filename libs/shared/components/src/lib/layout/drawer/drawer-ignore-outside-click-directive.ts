import { Directive } from '@angular/core';

@Directive({
  selector: '[mfDrawerIgnoreOutsideClick]',
  host: {
    'class': 'mf-drawer-ignore-outside-click'
  }
})
export class DrawerIgnoreOutsideClickDirective {
}
