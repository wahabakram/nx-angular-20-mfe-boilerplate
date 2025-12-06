import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SaleService, Sale } from '@samba/sale-domain';
import { Page } from '../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-sale-details',
  imports: [Page, MatButton, MatIcon, MatCard, MatCardContent, DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './sale-details.html',
  styleUrl: './sale-details.scss'
})
export class SaleDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private saleService = inject(SaleService);

  sale = signal<Sale | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSale(parseInt(id));
    }
  }

  loadSale(id: number): void {
    this.isLoading.set(true);
    this.saleService.getById(id).subscribe({
      next: (sale) => {
        this.sale.set(sale);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load sale details');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/sales']);
  }

  printReceipt(): void {
    window.print();
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      completed: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      cancelled: 'text-error bg-error/10',
      refunded: 'text-neutral bg-neutral/10'
    };
    return colorMap[status] || 'text-neutral bg-neutral/10';
  }

  getPaymentMethodLabel(method: string): string {
    return method.replace('_', ' ').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
