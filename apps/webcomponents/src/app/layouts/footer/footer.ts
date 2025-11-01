import { Component, input } from '@angular/core';

@Component({
  selector: 'mfc-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  appTitle = input<string>('webcomponents');
}
