import { Component } from '@angular/core';

@Component({
  selector: 'mfc-file-control,[mfc-file-control]',
  exportAs: 'mfcFileControl',
  templateUrl: './file-control.html',
  styleUrl: './file-control.scss',
  host: {
    'class': 'mfc-file-control'
  }
})
export class FileControl {
}
