import { Component, inject } from '@angular/core';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-crypto',
  imports: [],
  templateUrl: './crypto.html',
  styleUrl: './crypto.scss'
})
export class Crypto {
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
        name: 'Widgets',
        route: '/widgets/general',
        type: 'link',
      },
      {
        id: 'crypto',
        name: 'Crypto',
        type: null
      }
    ]);
  }
}
