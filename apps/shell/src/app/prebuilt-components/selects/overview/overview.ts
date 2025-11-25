import { Component, inject } from '@angular/core';
import {
  WorkspaceSelectExample
} from '../_examples/workspace-select-example/workspace-select-example';
import { Container } from '@/_partials/container/container';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    WorkspaceSelectExample,
    Container
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
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
        id: 'selects',
        name: 'Selects',
        type: null
      }
    ]);
  }
}
