import { Component, input, output, signal } from '@angular/core';
import {
  Datatable,
  HeadSelectionCell,
  RowSelectionCell,
} from '@ng-mf/components';
import { FileItem, FileSelectedEvent } from '@/applications/file-manager/types';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { NameCell } from '@/applications/file-manager/_cells/name-cell/name-cell';
import { AccessCell } from '@/applications/file-manager/_cells/access-cell/access-cell';
import { StarCell } from '@/applications/file-manager/_cells/star-cell/star-cell';
import { DateCell } from '@/datatables/_cells/date-cell/date-cell';

@Component({
  selector: 'app-file-list-layout',
  imports: [Datatable],
  templateUrl: './file-list-layout.html',
  styleUrl: './file-list-layout.scss',
})
export class FileListLayout {
  columns = signal<ColumnDef<FileItem>[]>([
    {
      header: 'Name',
      accessorKey: 'name',
      size: 800,
      minSize: 800,
      cell: () =>
        flexRenderComponent(NameCell, {
          inputs: {},
        }),
    },
    {
      id: 'star',
      header: '',
      accessorKey: 'isStarred',
      size: 60,
      enableResizing: false,
      cell: () =>
        flexRenderComponent(StarCell, {
          inputs: {},
        }),
    },
    {
      header: 'Who can access',
      accessorKey: 'access',
      size: 200,
      cell: () =>
        flexRenderComponent(AccessCell, {
          inputs: {},
        }),
    },
    {
      header: 'Modified',
      accessorKey: 'modified',
      size: 200,
      cell: () =>
        flexRenderComponent(DateCell, {
          inputs: {},
        }),
    },
  ]);
  files = input<FileItem[]>([]);

  readonly fileSelected = output<FileSelectedEvent>();

  onRowSelectionChanged(event: any) {
    console.log('onRowSelectionChanged', event);

    this.fileSelected.emit({
      files: event.selectedRowModel.rows,
    });
  }
}
