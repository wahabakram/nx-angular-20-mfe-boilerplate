import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcSegmentedIcon]',
  exportAs: 'mfcSegmentedIcon',
  host: {
    'class': 'mfc-segmented-icon'
  }
})
export class SegmentedIconDirective {
}
