import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcFilterBuilderOperationIcon]'
})
export class FilterBuilderOperationIconDirective {
  readonly templateRef = inject(TemplateRef);
}
