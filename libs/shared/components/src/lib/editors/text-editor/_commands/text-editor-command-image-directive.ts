import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';
import { UploadTriggerDirective } from '../../../media/upload/upload-trigger-directive';
import { UploadFileSelectedEvent } from '../../../media/upload/types';

@Directive({
  selector: '[mfTextEditorCommandImage]',
  exportAs: 'mfTextEditorCommandImage',
  hostDirectives: [
    {
      directive: UploadTriggerDirective,
      outputs: ['fileSelected'],
    },
  ],
  host: {
    '[attr.accept]': '"image/*"',
    '(fileSelected)': `onImageSelected($event)`,
  },
})
export class TextEditorCommandImageDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onImageSelected(event: UploadFileSelectedEvent): void {
    const file = event.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const src = reader.result as string;
      this.textEditor.api
        .editor()
        .chain()
        .focus()
        .addImageUploadingPlaceholder({ src, file })
        .run();
    };
  }
}
