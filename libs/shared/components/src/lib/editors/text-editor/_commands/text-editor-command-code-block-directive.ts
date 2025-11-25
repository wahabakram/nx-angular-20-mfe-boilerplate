import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandCodeBlock]',
  exportAs: 'mfTextEditorCommandCodeBlock',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleCodeBlock')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('codeBlock')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandCodeBlockDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleCodeBlock');
  }
}
