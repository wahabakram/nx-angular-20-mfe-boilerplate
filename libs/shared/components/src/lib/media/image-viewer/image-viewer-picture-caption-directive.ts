import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfImageViewerPictureCaption]',
})
export class ImageViewerPictureCaptionDirective {
  readonly templateRef = inject(TemplateRef);
}
