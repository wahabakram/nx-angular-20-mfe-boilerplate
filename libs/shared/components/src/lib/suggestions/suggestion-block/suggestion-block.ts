import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mf-suggestion-block',
  exportAs: 'mfSuggestionBlock',
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
