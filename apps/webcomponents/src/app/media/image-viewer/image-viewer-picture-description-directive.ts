import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcImageViewerPictureDescription]',
})
export class ImageViewerPictureDescriptionDirective {
  readonly templateRef = inject(TemplateRef);
}
