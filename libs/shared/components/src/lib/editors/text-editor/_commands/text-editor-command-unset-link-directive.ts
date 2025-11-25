import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandUnsetLink]',
  exportAs: 'mfTextEditorCommandUnsetLink',
  host: {
    '[class.button]': 'true',
    '(click)': `onClick()`
  }
})
export class TextEditorCommandUnsetLinkDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.editor().commands.unsetLink();
  }
}
