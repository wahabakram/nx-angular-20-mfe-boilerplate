import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfFilterBuilderOperationName]'
})
export class FilterBuilderOperationNameDirective {
  readonly templateRef = inject(TemplateRef);
}
