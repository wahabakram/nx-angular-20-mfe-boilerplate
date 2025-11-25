import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfDataViewEmptyData]',
  exportAs: 'mfDataViewEmptyData',
  host: {
    'class': 'mf-data-view-empty-data',
  }
})
export class DataViewEmptyDataDirective {
  readonly templateRef = inject(TemplateRef);
}
