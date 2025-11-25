import { Directive } from '@angular/core';

@Directive({
  selector: '[mfTextEditorCommand]',
  exportAs: 'mfTextEditorCommand',
  host: {
    '[class.button]': 'true'
  }
})
export class TextEditorCommandDirective {
}
