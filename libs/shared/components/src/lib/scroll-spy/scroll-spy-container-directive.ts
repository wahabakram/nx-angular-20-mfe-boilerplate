import { Directive } from '@angular/core';

@Directive({
  selector: '[mfScrollSpyContainer]',
  exportAs: 'mfScrollSpyContainer',
  host: {
    'class': 'mf-scroll-spy-container'
  }
})
export class ScrollSpyContainerDirective {
}
