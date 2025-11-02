import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcScrollSpyContainer]',
  exportAs: 'mfcScrollSpyContainer',
  host: {
    'class': 'mfc-scroll-spy-container'
  }
})
export class ScrollSpyContainerDirective {
}
