import { AfterViewInit, Component, inject, viewChild } from '@angular/core';

import { MatButton } from '@angular/material/button';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CurrentPlanWidget } from '@/widgets/_widgets/current-plan-widget/current-plan-widget';
// import {
//   PaymentInformationWidget
// } from '@/widgets/_widgets/payment-information-widget/payment-information-widget';
import { BreadcrumbsStore } from '@ng-mf/components';
import { BILLING_INFO, BILLING_TABLE_DATA } from '@/account/settings/mock-data/billing.mock';
import { AnalyticsEndedProjectsWidget } from '@/widgets/_widgets/analytics-ended-projects-widget/analytics-ended-projects-widget';
@Component({
  imports: [
    MatButton,
    CurrentPlanWidget,
    // PaymentInformationWidget,
    AnalyticsEndedProjectsWidget,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatPaginator,
    MatRow,
    MatTable,
    DatePipe,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef
  ],
  templateUrl: './billing.html',
  styleUrl: './billing.scss'
})
export class Billing implements AfterViewInit {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  dataSource = new MatTableDataSource(BILLING_TABLE_DATA);
  displayedColumns = ['invoiceId', 'date', 'amount', 'status', 'invoice'];
  billingInfo = BILLING_INFO;

  readonly paginator = viewChild.required<MatPaginator>('paginator');

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
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'billing',
        name: 'Billing',
        type: null
      }
    ]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator();
  }
}
