import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcUploadAreaDropState]'
})
export class UploadAreaDropStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
