import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandStrike]',
  exportAs: 'mfTextEditorCommandStrike',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleStrike')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('strike')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandStrikeDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleStrike');
  }
}
