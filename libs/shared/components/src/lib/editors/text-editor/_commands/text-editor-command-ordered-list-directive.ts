import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandOrderedList]',
  exportAs: 'mfTextEditorCommandOrderedList',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleOrderedList')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('orderedList')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandOrderedListDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleOrderedList');
  }
}
