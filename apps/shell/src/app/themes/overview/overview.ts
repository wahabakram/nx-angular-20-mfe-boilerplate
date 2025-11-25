import { Component, inject, DOCUMENT } from '@angular/core';

import { Page } from '@/meta/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    Page,
    PageContentDirective
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  private _document = inject(DOCUMENT);
  themes: {[prop: string]: string} = {
    'rose-red': 'rose-red.css',
    'magenta-violet': 'magenta-violet.css',
    'cyan-orange': 'cyan-orange.css',
  };
  selectedThemeName!: string;

  loadTheme(themeName: string) {
    const head  = this._document.getElementsByTagName('head')[0];
    const link  = this._document.createElement('link');
    const themePath = this.themes[themeName];
    link.id = themeName;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = `/${themePath}`;
    link.media = 'all';
    head.appendChild(link);
    this.selectedThemeName = themeName;
  }

  isSelected(themeName: string): boolean {
    return this.selectedThemeName === themeName;
  }

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'themes',
        name: 'Themes',
        type: null
      }
    ]);
  }
}
