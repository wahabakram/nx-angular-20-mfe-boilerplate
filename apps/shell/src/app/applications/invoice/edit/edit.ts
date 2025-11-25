import { Component, inject } from '@angular/core';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [],
  templateUrl: './edit.html',
  styleUrl: './edit.scss'
})
export class Edit {
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
        name: 'Edit Invoice',
        type: null
      }
    ]);
  }
}
