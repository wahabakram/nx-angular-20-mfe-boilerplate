import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfUploadAreaInvalidState]'
})
export class UploadAreaInvalidStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
