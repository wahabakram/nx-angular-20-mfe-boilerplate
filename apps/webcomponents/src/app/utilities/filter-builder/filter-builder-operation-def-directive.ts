import { Directive, contentChild, input } from '@angular/core';
import { FilterBuilderOperationNameDirective } from './filter-builder-operation-name-directive';
import { FilterBuilderOperationIconDirective } from './filter-builder-operation-icon-directive';

@Directive({
  selector: '[mfcFilterBuilderOperationDef]'
})
export class FilterBuilderOperationDefDirective {
  id = input('', {
    alias: 'mfcFilterBuilderOperationDef'
  });
  allowedDataTypes = input<string[]>([]);
  readonly operationName = contentChild(FilterBuilderOperationNameDirective);
  readonly operationIcon = contentChild(FilterBuilderOperationIconDirective);
}
