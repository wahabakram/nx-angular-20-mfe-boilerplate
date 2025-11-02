import { Component } from '@angular/core';

@Component({
  selector: 'mfc-breadcrumb-item,[mfc-breadcrumb-item]',
  exportAs: 'mfcBreadcrumbItem',
  templateUrl: './breadcrumb-item.html',
  styleUrl: './breadcrumb-item.scss',
  host: {
    class: 'mfc-breadcrumb-item'
  }
})
export class BreadcrumbItem {
}
