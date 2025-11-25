import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfreaseControl]',
  exportAs: 'mfIncreaseControl',
})
export class IncreaseControlDirective {
  readonly templateRef = inject(TemplateRef);
}
