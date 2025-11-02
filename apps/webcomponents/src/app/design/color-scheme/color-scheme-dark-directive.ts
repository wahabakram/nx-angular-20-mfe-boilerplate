import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcColorSchemeDark]'
})
export class ColorSchemeDarkDirective {
  readonly templateRef = inject(TemplateRef);
}
