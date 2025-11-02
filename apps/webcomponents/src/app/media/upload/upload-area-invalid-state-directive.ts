import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcUploadAreaInvalidState]'
})
export class UploadAreaInvalidStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
