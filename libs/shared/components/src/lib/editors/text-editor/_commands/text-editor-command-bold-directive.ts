import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandBold]',
  exportAs: 'mfTextEditorCommandBold',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleBold')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('bold')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandBoldDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleBold');
  }
}
