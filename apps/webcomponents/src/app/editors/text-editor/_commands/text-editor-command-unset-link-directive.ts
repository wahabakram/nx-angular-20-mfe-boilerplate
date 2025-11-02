import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[mfcTextEditorCommandUnsetLink]',
  exportAs: 'mfcTextEditorCommandUnsetLink',
  host: {
    '[class.button]': 'true',
    '(click)': `onClick()`
  }
})
export class TextEditorCommandUnsetLinkDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.editor().commands.unsetLink();
  }
}
