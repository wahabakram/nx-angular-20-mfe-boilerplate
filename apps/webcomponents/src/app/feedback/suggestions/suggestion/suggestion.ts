import { Component } from '@angular/core';

@Component({
  selector: 'mfc-suggestion,[mfc-suggestion]',
  exportAs: 'mfcSuggestion',
  imports: [],
  templateUrl: './suggestion.html',
  styleUrl: './suggestion.scss',
  host: {
    'class': 'mfc-suggestion hover:bg-base-200 cursor-pointer'
  }
})
export class Suggestion {

}
