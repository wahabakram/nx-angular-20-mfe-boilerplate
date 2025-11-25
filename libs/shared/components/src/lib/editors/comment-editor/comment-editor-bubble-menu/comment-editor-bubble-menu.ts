import { Component, forwardRef, inject } from '@angular/core';
import { COMMENT_EDITOR, COMMENT_EDITOR_BUBBLE_MENU, ICommentEditor } from '../types';

@Component({
  selector: 'mf-comment-editor-bubble-menu',
  exportAs: 'mfCommentEditorBubbleMenu',
  providers: [
    {
      provide: COMMENT_EDITOR_BUBBLE_MENU,
      useExisting: forwardRef(() => CommentEditorBubbleMenu)
    }
  ],
  templateUrl: './comment-editor-bubble-menu.html',
  styleUrl: './comment-editor-bubble-menu.scss',
  host: {
    'class': 'mf-comment-editor-bubble-menu',
  }
})
export class CommentEditorBubbleMenu {
  protected commentEditor = inject<ICommentEditor>(COMMENT_EDITOR);

  getLinkUrl(): string | null {
    return (this.commentEditor.api.editor()?.getAttributes('link') as HTMLLinkElement).href || null;
  }
}
