import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfImageViewerPictureDescription]',
})
export class ImageViewerPictureDescriptionDirective {
  readonly templateRef = inject(TemplateRef);
}
