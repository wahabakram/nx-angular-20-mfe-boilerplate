import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfFilterBuilderOperationIcon]'
})
export class FilterBuilderOperationIconDirective {
  readonly templateRef = inject(TemplateRef);
}
