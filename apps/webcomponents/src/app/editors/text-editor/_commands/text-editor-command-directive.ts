import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcTextEditorCommand]',
  exportAs: 'mfcTextEditorCommand',
  host: {
    '[class.button]': 'true'
  }
})
export class TextEditorCommandDirective {
}
