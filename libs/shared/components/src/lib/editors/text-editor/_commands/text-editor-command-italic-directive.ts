import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandItalic]',
  exportAs: 'mfTextEditorCommandItalic',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleItalic')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('italic')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandItalicDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleItalic');
  }
}
