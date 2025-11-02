import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcCommentEditorCommand]',
  
  host: {
    '[class.button]': 'true'
  }
})
export class CommentEditorCommandDirective {

}
