import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, TextEditor } from '../types';

@Directive({
  selector: '[mfcTextEditorCommandBlockquote]',
  exportAs: 'mfcTextEditorCommandBlockquote',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleBlockquote')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('blockquote')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandBlockquoteDirective {
  protected textEditor = inject<TextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleBlockquote');
  }
}
