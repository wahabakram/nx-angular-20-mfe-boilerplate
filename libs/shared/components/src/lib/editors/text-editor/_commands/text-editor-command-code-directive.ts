import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandCode]',
  exportAs: 'mfTextEditorCommandCode',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleCode')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('code')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandCodeDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleCode');
  }
}
