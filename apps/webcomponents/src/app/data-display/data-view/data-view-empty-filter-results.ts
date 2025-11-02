import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcDataViewEmptyFilterResults]',
  exportAs: 'mfcDataViewEmptyFilterResults',
  host: {
    'class': 'mfc-data-view-empty-filter-results',
  }
})
export class DataViewEmptyFilterResultsDirective {
  readonly templateRef = inject(TemplateRef);
}
