
import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, ICommentEditor } from '../types';

@Directive({
  selector: '[mfCommentEditorCommandBulletList]',
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleBulletList')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('bulletList')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandBulletListDirective {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleBulletList');
  }
}
