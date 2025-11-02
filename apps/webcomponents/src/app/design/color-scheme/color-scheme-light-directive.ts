import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcColorSchemeLight]'
})
export class ColorSchemeLightDirective {
  readonly templateRef = inject(TemplateRef);
}
