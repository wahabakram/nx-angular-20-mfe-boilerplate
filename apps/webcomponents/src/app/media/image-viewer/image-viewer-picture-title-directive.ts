import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcImageViewerPictureTitle]',
})
export class ImageViewerPictureTitleDirective {
  readonly templateRef = inject(TemplateRef);
}
