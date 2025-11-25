import { Directive, inject } from '@angular/core';
import { TEXT_EDITOR, ITextEditor } from '../types';

@Directive({
  selector: '[mfTextEditorCommandBulletList]',
  exportAs: 'mfTextEditorCommandBulletList',
  host: {
    '[attr.disabled]': `(textEditor && textEditor.api.isCommandDisabled('toggleBulletList')) ? '' : null`,
    '[class.active]': `textEditor && textEditor.api.isActive('bulletList')`,
    '(click)': `onClick()`
  }
})
export class TextEditorCommandBulletListDirective {
  protected textEditor = inject<ITextEditor>(TEXT_EDITOR);

  protected onClick() {
    this.textEditor.api.runCommand('toggleBulletList');
  }
}
