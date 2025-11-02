import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcIncreaseControl]',
  exportAs: 'mfcIncreaseControl',
})
export class IncreaseControlDirective {
  readonly templateRef = inject(TemplateRef);
}
