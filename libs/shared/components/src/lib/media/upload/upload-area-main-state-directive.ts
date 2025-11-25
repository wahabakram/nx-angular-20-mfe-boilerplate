import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfUploadAreaMainState]'
})
export class UploadAreaMainStateDirective {
  readonly templateRef = inject(TemplateRef, { optional: true });
}
