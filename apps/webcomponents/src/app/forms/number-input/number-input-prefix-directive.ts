import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNumberInputPrefix]',
  exportAs: 'mfcNumberInputPrefix',
})
export class NumberInputPrefixDirective {
  readonly templateRef = inject(TemplateRef);
}
