import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcDecreaseControl]',
  exportAs: 'mfcDecreaseControl',
})
export class DecreaseControlDirective {
  readonly templateRef = inject(TemplateRef);
}
