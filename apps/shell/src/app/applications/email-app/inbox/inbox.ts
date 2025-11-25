import { Component, inject, signal } from '@angular/core';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { Datatable } from '@ng-mf/components';
import { flexRenderComponent } from '@tanstack/angular-table';
import { FromCell } from '@/applications/email-app/_cells/from-cell/from-cell';
import { SubjectCell } from '@/applications/email-app/_cells/subject-cell/subject-cell';
import { emails } from '@/applications/email-app/data';
import { OverlayScrollbar } from '@ng-mf/components';
import { PanelBody, Panel, PanelHeader } from '@ng-mf/components';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { SegmentedButton, Segmented } from '@ng-mf/components';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { VerticalDivider } from '@ng-mf/components';
import { MatTooltip } from '@angular/material/tooltip';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    MatTab,
    MatTabGroup,
    Datatable,
    OverlayScrollbar,
    Panel,
    PanelHeader,
    PanelBody,
    MatCheckbox,
    Segmented,
    SegmentedButton,
    MatIconButton,
    MatIcon,
    VerticalDivider,
    MatTooltip,
    MatTabLabel,
  ],
  templateUrl: './inbox.html',
  styleUrl: './inbox.scss',
})
export class Inbox {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly view = signal('all');
  readonly columns = signal([
    {
      header: 'From',
      accessorKey: 'from',
      size: 300,
      cell: () => {
        return flexRenderComponent(FromCell, {
          inputs: {},
        });
      },
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      minSize: 0,
      size: 0,
      cell: () => {
        return flexRenderComponent(SubjectCell, {
          inputs: {},
        });
      },
    },
    {
      header: 'Date',
      accessorKey: 'date',
      size: 100,
    },
  ]);
  readonly data = signal(emails);
  readonly rowSelectionLength = signal(0);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'email',
        name: 'Email',
        route: '/applications/email-app/inbox',
        type: 'link',
      },
      {
        id: 'inbox',
        name: 'Inbox',
        type: null,
      },
    ]);
  }

  onAllSelected(event: MatCheckboxChange, datatable: Datatable<any>) {
    if (event.checked) {
      datatable.checkAll();
    } else {
      datatable.uncheckAll();
    }
  }

  onRowSelectionChanged(event: any) {
    this.rowSelectionLength.set(event.rowSelectionLength);
  }

  isIntermediate() {
    return (
      this.rowSelectionLength() > 0 &&
      this.rowSelectionLength() < this.data().length
    );
  }

  getPaginatedFrom(datatable: Datatable<any>) {
    return (
      datatable.table.getState().pagination.pageIndex *
        datatable.table.getState().pagination.pageSize +
      1
    );
  }

  getPaginatedTo(datatable: Datatable<any>) {
    const paginatedTo =
      (datatable.table.getState().pagination.pageIndex + 1) *
      datatable.table.getState().pagination.pageSize;
    return paginatedTo > this.data().length ? this.data().length : paginatedTo;
  }
}
