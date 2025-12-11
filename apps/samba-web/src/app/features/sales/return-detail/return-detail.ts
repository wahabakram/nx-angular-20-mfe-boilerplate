import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReturnApi, Return } from '@samba/return-domain';
import { Page } from '../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-return-detail',
  imports: [
    Page,
    MatButton,
    Icon,
    MatCard,
    MatCardContent,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    RouterLink,
  ],
  templateUrl: './return-detail.html',
  styleUrl: './return-detail.scss',
})
export class ReturnDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private returnApi = inject(ReturnApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  returnRecord = signal<Return | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReturn(parseInt(id));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'sales',
          name: 'Sales',
          route: '/sales',
          type: 'link',
        },
        {
          id: 'returns',
          name: 'Returns',
          route: '/sales/returns',
          type: 'link',
        },
        {
          id: 'return-details',
          name: `Return #${id}`,
          type: null,
        },
      ]);
    }
  }

  loadReturn(id: number): void {
    this.isLoading.set(true);
    this.returnApi.getById(id).subscribe({
      next: (returnRecord) => {
        this.returnRecord.set(returnRecord);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load return details');
        this.isLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/sales/returns']);
  }

  printReceipt(): void {
    window.print();
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      completed: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      rejected: 'text-error bg-error/10',
      'in-review': 'text-info bg-info/10',
    };
    return colorMap[status] || 'text-neutral bg-neutral/10';
  }

  getRefundMethodLabel(method: string): string {
    return method
      .replace('-', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  getReasonLabel(reason: string): string {
    return reason
      .replace('-', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
