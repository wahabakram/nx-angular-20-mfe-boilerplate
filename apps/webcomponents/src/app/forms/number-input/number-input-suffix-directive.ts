import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNumberInputSuffix]',
  exportAs: 'mfcNumberInputSuffix',
})
export class NumberInputSuffixDirective {
  readonly templateRef = inject(TemplateRef);
}
