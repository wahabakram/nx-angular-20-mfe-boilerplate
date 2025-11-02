import { Component } from '@angular/core';

@Component({
  selector: 'mfc-file-list',
  exportAs: 'mfcFileList',
  templateUrl: './file-list.html',
  styleUrl: './file-list.scss',
  host: {
    'class': 'mfc-file-list'
  }
})
export class FileList {
}
