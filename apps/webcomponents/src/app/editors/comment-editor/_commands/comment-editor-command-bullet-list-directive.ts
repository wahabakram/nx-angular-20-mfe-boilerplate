
import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, CommentEditor } from '../types';

@Directive({
  selector: '[mfcCommentEditorCommandBulletList]',
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleBulletList')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('bulletList')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandBulletListDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleBulletList');
  }
}
