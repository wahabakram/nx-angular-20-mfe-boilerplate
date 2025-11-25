import { Component } from '@angular/core';

@Component({
  selector: 'mf-suggestion,[mf-suggestion]',
  exportAs: 'mfSuggestion',
  imports: [],
  templateUrl: './suggestion.html',
  styleUrl: './suggestion.scss',
  host: {
    'class': 'mf-suggestion hover:bg-base-200 cursor-pointer'
  }
})
export class Suggestion {

}
