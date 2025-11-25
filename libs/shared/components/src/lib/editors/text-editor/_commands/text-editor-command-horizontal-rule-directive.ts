import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandHorizontalRule]',
  host: {
    '[class.button]': 'true',
    '(click)': `onClick()`
  }
})
export class TextEditorCommandHorizontalRuleDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.editor().chain().focus().setHorizontalRule().run();
  }
}
