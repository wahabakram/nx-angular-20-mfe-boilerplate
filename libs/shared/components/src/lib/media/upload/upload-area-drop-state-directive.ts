import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfUploadAreaDropState]'
})
export class UploadAreaDropStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
