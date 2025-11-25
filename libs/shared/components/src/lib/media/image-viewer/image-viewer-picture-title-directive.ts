import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfImageViewerPictureTitle]',
})
export class ImageViewerPictureTitleDirective {
  readonly templateRef = inject(TemplateRef);
}
