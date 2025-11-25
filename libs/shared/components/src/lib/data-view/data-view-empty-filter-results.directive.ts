import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfDataViewEmptyFilterResults]',
  exportAs: 'mfDataViewEmptyFilterResults',
  host: {
    'class': 'mf-data-view-empty-filter-results',
  }
})
export class DataViewEmptyFilterResultsDirective {
  readonly templateRef = inject(TemplateRef);
}
