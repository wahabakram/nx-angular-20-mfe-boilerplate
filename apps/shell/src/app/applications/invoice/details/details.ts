import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BreadcrumbsStore } from '@ng-mf/components';

import { InvoiceDetailsMock } from '../invoice.model';
import { invoiceDetailsMock } from '../mock-data';
import { Dicebear } from '@ng-mf/components';
import {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineItemIndicatorDirective,
  TimelineSubtitle,
  TimelineTitle
} from '@ng-mf/components';

@Component({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIcon,
    Dicebear,
    TimelineTitle,
    TimelineItemIndicatorDirective,
    TimelineItem,
    Timeline,
    TimelineContent,
    TimelineSubtitle
  ],
  templateUrl: './details.html',
  styleUrl: './details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Details {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  // Expose mock data to the template as a signal for template control-flow and reactivity
  readonly data = signal<InvoiceDetailsMock>(invoiceDetailsMock);

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
        name: 'Details',
        type: null
      }
    ]);
  }
}
