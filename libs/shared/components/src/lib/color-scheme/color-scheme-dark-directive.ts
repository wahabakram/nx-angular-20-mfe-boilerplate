import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfColorSchemeDark]'
})
export class ColorSchemeDarkDirective {
  readonly templateRef = inject(TemplateRef);
}
