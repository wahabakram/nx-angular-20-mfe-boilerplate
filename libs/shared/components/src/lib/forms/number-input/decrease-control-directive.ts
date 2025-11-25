import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfDecreaseControl]',
  exportAs: 'mfDecreaseControl',
})
export class DecreaseControlDirective {
  readonly templateRef = inject(TemplateRef);
}
