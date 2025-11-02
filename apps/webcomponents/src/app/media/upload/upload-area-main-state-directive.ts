import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcUploadAreaMainState]'
})
export class UploadAreaMainStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
