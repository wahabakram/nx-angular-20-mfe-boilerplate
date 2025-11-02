import { Component } from '@angular/core';

@Component({
  selector: 'mfc-comment-editor-toolbar',
  exportAs: 'mfcCommentEditorToolbar',
  templateUrl: './comment-editor-toolbar.html',
  styleUrl: './comment-editor-toolbar.scss',
  host: {
    'class': 'mfc-comment-editor-toolbar',
  }
})
export class CommentEditorToolbar {
}
