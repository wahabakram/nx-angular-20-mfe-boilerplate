import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNumberInputPrefix]',
  exportAs: 'mfNumberInputPrefix',
})
export class NumberInputPrefixDirective {
  readonly templateRef = inject(TemplateRef);
}
