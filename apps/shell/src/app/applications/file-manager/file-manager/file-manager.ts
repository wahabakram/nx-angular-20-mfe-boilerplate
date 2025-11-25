import { Component, inject } from '@angular/core';
import { Avatar } from '@ng-mf/components';
import { FileGridLayout } from '@/applications/file-manager/_layout/file-grid-layout/file-grid-layout';
import { FileListLayout } from '@/applications/file-manager/_layout/file-list-layout/file-list-layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MenuOptionGroupDirective } from '@ng-mf/components';
import { FileItem, FileSelectedEvent } from '@/applications/file-manager/types';
import { mockFiles } from '@/applications/file-manager/mock-data';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/autocomplete';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Container } from '@/_partials/container/container';
import { OverlayScrollbar } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-file-manager',
  imports: [
    Avatar,
    FileGridLayout,
    FileListLayout,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatChipListbox,
    MatChipOption,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatOption,
    MatRipple,
    MatTooltip,
    MenuOptionGroupDirective,
    ReactiveFormsModule,
    MatMenuTrigger,
    Container,
    OverlayScrollbar,
  ],
  templateUrl: './file-manager.html',
  styleUrl: './file-manager.scss',
})
export class FileManager {
  private _fb = inject(FormBuilder);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  settingsForm = this._fb.group({
    layout: ['grid'],
    filePreview: ['fullscreen'],
  });
  starredIds: string[] = ['4'];
  files: FileItem[] = mockFiles;
  selectedFiles: FileItem[] = [];

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'fileManager',
        name: 'File Manager',
        type: null,
      },
    ]);
  }

  get indeterminate(): boolean {
    return this.checked && this.selectedFiles.length !== this.files.length;
  }

  get checked(): boolean {
    return this.selectedFiles.length > 0;
  }

  fileSelected(event: FileSelectedEvent): void {
    this.selectedFiles = event.files;
  }
}
