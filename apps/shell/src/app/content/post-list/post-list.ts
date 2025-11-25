import { Component, inject, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import {
  DataView,
  DataViewActionBarDirective,
  DataViewAPI,
  DataViewActionBar,
  DataViewCellRenderer,
  DataViewColumnDef,
  DataViewType,
  DataViewEmptyDataDirective,
  DataViewEmptyFilterResultsDirective,
  DataViewRowSelectionEvent,
} from '@ng-mf/components';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  BlockStateActions,
  BlockState,
  BlockStateContent,
  BlockStateIcon,
  BlockStateImage,
} from '@ng-mf/components';
import { PanelBody, Panel, PanelFooter, PanelHeader } from '@ng-mf/components';
import { VerticalDivider } from '@ng-mf/components';
import { SegmentedButton, Segmented } from '@ng-mf/components';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  title: string;
  author: User;
  status: string;
  createdAt: Date;
  publishedAt?: Date;
}

@Component({
  imports: [
    DataView,
    MatPaginator,
    FormsModule,
    MatButton,
    MatIcon,
    VerticalDivider,
    MatIconButton,
    SegmentedButton,
    Segmented,
    DataViewActionBar,
    DataViewActionBarDirective,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    BlockState,
    DataViewEmptyDataDirective,
    BlockStateContent,
    DataViewEmptyFilterResultsDirective,
    BlockStateIcon,
    PanelHeader,
    Panel,
    PanelFooter,
    PanelBody,
  ],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList implements OnInit {
  private _httpClient = inject(HttpClient);

  status = 'all';
  columnDefs: DataViewColumnDef[] = [
    {
      name: 'Id',
      dataField: 'id',
      visible: false,
    },
    {
      name: 'Title',
      dataField: 'title',
      visible: true,
    },
    {
      name: 'Author',
      dataField: 'author',
      dataRenderer: 'author',
      visible: true,
    },
    {
      name: 'Created At',
      dataField: 'createdAt',
      dataRenderer: 'date',
      visible: true,
    },
    {
      name: 'Published At',
      dataField: 'publishedAt',
      dataRenderer: 'date',
      visible: true,
    },
  ];
  data: Post[] = [];
  selectedRows: Post[] = [];
  cellRenderers: DataViewCellRenderer[] = [
    {
      dataRenderer: 'author',
      component: () =>
        import('../_renderers/dv-author-renderer/dv-author-renderer').then(
          (c) => c.DvAuthorRenderer
        ),
    },
    {
      dataRenderer: 'date',
      component: () =>
        import('../_renderers/dv-date-renderer/dv-date-renderer').then(
          (c) => c.DvDateRenderer
        ),
    },
  ];
  search = '';

  ngOnInit() {
    this._httpClient
      .get<Post[]>('/assets/mockdata/content-post-list.json')
      .subscribe((data) => {
        this.data = data;
      });
  }

  rowSelectionChanged(event: DataViewRowSelectionEvent<Post>): void {
    // console.log(event.checked);
  }

  selectionChanged(rows: Post[]): void {
    this.selectedRows = rows;
  }

  allRowsSelectionChanged(isAllSelected: boolean): void {
    // console.log(isAllSelected);
  }
}
