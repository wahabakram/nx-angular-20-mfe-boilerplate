import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, CommentEditor } from '../types';

@Directive({
  selector: '[mfcCommentEditorCommandUnsetLink]',
  host: {
    '[class.button]': 'true',
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandUnsetLinkDirective {
  protected commentEditor = inject<CommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.editor().commands.unsetLink();
  }
}
