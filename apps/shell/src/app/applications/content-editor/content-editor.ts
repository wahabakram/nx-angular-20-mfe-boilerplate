import { Component, inject } from '@angular/core';
import { ContentBuilder } from '@ng-mf/components';
import { Page } from '@/_partials/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { Alert } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-content-editor',
  imports: [ContentBuilder, Page, PageContentDirective, Alert],
  templateUrl: './content-editor.html',
  styleUrl: './content-editor.scss',
})
export class ContentEditor {
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
        id: 'contentEditor',
        name: 'Content Editor',
        type: null,
      },
    ]);
  }
}
