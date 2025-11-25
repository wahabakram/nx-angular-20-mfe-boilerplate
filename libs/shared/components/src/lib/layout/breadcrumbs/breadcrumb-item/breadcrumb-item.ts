import { Component } from '@angular/core';

@Component({
  selector: 'mf-breadcrumb-item,[mf-breadcrumb-item]',
  exportAs: 'mfBreadcrumbItem',
  templateUrl: './breadcrumb-item.html',
  styleUrl: './breadcrumb-item.scss',
  host: {
    class: 'mf-breadcrumb-item'
  }
})
export class BreadcrumbItem {
}
