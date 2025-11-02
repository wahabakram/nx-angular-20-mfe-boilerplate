import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcDataViewEmptyData]',
  exportAs: 'mfcDataViewEmptyData',
  host: {
    'class': 'mfc-data-view-empty-data',
  }
})
export class DataViewEmptyDataDirective {
  readonly templateRef = inject(TemplateRef);
}
