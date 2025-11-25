import { Directive } from '@angular/core';

@Directive({
  selector: '[mfCommentEditorCommand]',
  
  host: {
    '[class.button]': 'true'
  }
})
export class CommentEditorCommandDirective {

}
