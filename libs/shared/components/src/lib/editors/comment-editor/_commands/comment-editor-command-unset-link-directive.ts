import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, ICommentEditor } from '../types';

@Directive({
  selector: '[mfCommentEditorCommandUnsetLink]',
  host: {
    '[class.button]': 'true',
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandUnsetLinkDirective {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.editor().commands.unsetLink();
  }
}
