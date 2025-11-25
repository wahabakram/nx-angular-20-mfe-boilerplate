import { Directive } from '@angular/core';

@Directive({
  selector: '[mfSegmentedIcon]',
  exportAs: 'mfSegmentedIcon',
  host: {
    'class': 'mf-segmented-icon'
  }
})
export class SegmentedIconDirective {
}
