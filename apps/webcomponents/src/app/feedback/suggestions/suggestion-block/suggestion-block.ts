import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mfc-suggestion-block',
  exportAs: 'mfcSuggestionBlock',
  imports: [],
  templateUrl: './suggestion-block.html',
  styleUrl: './suggestion-block.scss'
})
export class SuggestionBlock {
  heading = input();
  showDivider = input(false, {
    transform: booleanAttribute,
  });
  inline = input(false, {
    transform: booleanAttribute,
  });
}
