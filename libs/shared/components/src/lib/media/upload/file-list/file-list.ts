import { Component } from '@angular/core';

@Component({
  selector: 'mf-file-list',
  exportAs: 'mfFileList',
  templateUrl: './file-list.html',
  styleUrl: './file-list.scss',
  host: {
    'class': 'mf-file-list'
  }
})
export class FileList {
}
