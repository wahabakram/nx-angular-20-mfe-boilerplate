import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcImageViewerPictureCaption]',
})
export class ImageViewerPictureCaptionDirective {
  readonly templateRef = inject(TemplateRef);
}
