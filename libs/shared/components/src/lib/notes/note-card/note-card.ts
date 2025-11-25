import { Component, input } from '@angular/core';

@Component({
  selector: 'mf-note-card',
  imports: [],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss'
})
export class NoteCard {
  color = input<string>();
}
