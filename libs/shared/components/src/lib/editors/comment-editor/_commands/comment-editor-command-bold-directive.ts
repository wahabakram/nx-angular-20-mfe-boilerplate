import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, ICommentEditor } from '../types';

@Directive({
  selector: '[mfCommentEditorCommandBold]',
  exportAs: 'mfCommentEditorCommandBold',
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleBold')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('bold')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandBoldDirective {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleBold');
  }
}
