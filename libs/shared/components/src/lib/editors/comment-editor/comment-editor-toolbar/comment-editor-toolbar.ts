import { Component } from '@angular/core';

@Component({
  selector: 'mf-comment-editor-toolbar',
  exportAs: 'mfCommentEditorToolbar',
  templateUrl: './comment-editor-toolbar.html',
  styleUrl: './comment-editor-toolbar.scss',
  host: {
    'class': 'mf-comment-editor-toolbar',
  }
})
export class CommentEditorToolbar {
}
