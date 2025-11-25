import { Component, inject } from '@angular/core';
import {
  PanelBody,
  Panel,
  PanelHeader
} from '@ng-mf/components';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { InvoiceBuilder } from '@ng-mf/components';
import { RouterLink } from '@angular/router';
import { OverlayScrollbar } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    Panel,
    PanelBody,
    MatButton,
    PanelHeader,
    MatIcon,
    InvoiceBuilder,
    MatIconButton,
    RouterLink,
    OverlayScrollbar
  ],
  templateUrl: './new.html',
  styleUrl: './new.scss'
})
export class New {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Invoices',
        route: '/applications/invoice/list',
        type: 'link',
      },
      {
        id: 'new',
        name: 'New Invoice',
        type: null
      }
    ]);
  }
}
