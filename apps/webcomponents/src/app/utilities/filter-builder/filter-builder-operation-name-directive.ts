import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcFilterBuilderOperationName]'
})
export class FilterBuilderOperationNameDirective {
  readonly templateRef = inject(TemplateRef);
}
