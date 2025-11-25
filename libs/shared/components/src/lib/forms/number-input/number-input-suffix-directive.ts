import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNumberInputSuffix]',
  exportAs: 'mfNumberInputSuffix',
})
export class NumberInputSuffixDirective {
  readonly templateRef = inject(TemplateRef);
}
