import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { DEVICES_TABLE_DATA, WEB_BROWSERS_TABLE_DATA } from '@/account/settings/mock-data/sessions.mock';

@Component({
  imports: [
    MatButton,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatRowDef,
    MatHeaderRowDef,
  ],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss'
})
export class Sessions {
  webBrowsersDataSource = new MatTableDataSource(WEB_BROWSERS_TABLE_DATA);
  webBrowsersDisplayedColumns = ['browser', 'location', 'recentActivity', 'terminate'];

  devicesDataSource = new MatTableDataSource(DEVICES_TABLE_DATA);
  devicesDisplayedColumns = ['browser', 'location', 'recentActivity', 'terminate'];
}
