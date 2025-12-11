import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PurchaseApi, Purchase } from '@samba/purchase-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore, Panel, PanelHeader, PanelBody } from '@ng-mf/components';

@Component({
  selector: 'app-purchase-detail',
  imports: [
    MatButton,
    Icon,
    MatCard,
    MatCardContent,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Panel,
    PanelHeader,
    PanelBody,
    RouterLink
  ],
  templateUrl: './purchase-detail.html',
  styleUrl: './purchase-detail.scss'
})
export class PurchaseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  purchase = signal<Purchase | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPurchase(parseInt(id));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'purchases',
          name: 'Purchases',
          route: '/purchases',
          type: 'link',
        },
        {
          id: 'purchase-details',
          name: `PO #${id}`,
          type: null,
        },
      ]);
    }
  }

  loadPurchase(id: number): void {
    this.isLoading.set(true);
    this.purchaseApi.getById(id).subscribe({
      next: (purchase) => {
        this.purchase.set(purchase);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load purchase order details');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/purchases']);
  }

  receivePurchase(): void {
    const purchase = this.purchase();
    if (purchase) {
      this.router.navigate(['/purchases', purchase.id, 'receive']);
    }
  }

  createReturn(): void {
    const purchase = this.purchase();
    if (purchase) {
      this.router.navigate(['/purchases/returns/new', purchase.id]);
    }
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      draft: 'text-neutral bg-neutral/10',
      ordered: 'text-warning bg-warning/10',
      received: 'text-success bg-success/10',
      cancelled: 'text-error bg-error/10',
    };
    return colorMap[status] || 'text-neutral bg-neutral/10';
  }

  getPaymentStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      paid: 'text-success bg-success/10',
      partial: 'text-warning bg-warning/10',
      pending: 'text-neutral bg-neutral/10',
    };
    return colorMap[status] || 'text-neutral bg-neutral/10';
  }
}
