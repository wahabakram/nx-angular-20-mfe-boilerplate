import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, ICommentEditor } from '../types';

@Directive({
  selector: '[mfCommentEditorCommandToggleToolbar]',
  host: {
    '[class.active]': `commentEditor && commentEditor.api.isToolbarActive()`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandToggleToolbarDirective {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  protected onClick(): void {
    this.commentEditor.api.toggleToolbar();
  }
}
