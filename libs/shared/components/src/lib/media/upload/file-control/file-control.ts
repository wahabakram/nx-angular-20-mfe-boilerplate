import { Component } from '@angular/core';

@Component({
  selector: 'mf-file-control,[mf-file-control]',
  exportAs: 'mfFileControl',
  templateUrl: './file-control.html',
  styleUrl: './file-control.scss',
  host: {
    'class': 'mf-file-control'
  }
})
export class FileControl {
}
