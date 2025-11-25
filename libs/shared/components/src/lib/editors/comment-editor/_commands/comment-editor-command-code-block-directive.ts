import { Directive, inject } from '@angular/core';
import { COMMENT_EDITOR, ICommentEditor } from '../types';

@Directive({
  selector: '[mfCommentEditorCommandCodeBlock]',
  host: {
    '[attr.disabled]': `(commentEditor && commentEditor.api.isCommandDisabled('toggleCodeBlock')) ? '' : null`,
    '[class.active]': `commentEditor && commentEditor.api.isActive('codeBlock')`,
    '(click)': `onClick()`
  }
})
export class CommentEditorCommandCodeBlockDirective {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  protected onClick() {
    this.commentEditor.api.runCommand('toggleCodeBlock');
  }
}
