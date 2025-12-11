import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierApi, Supplier } from '@samba/supplier-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore, Panel, PanelHeader, PanelBody } from '@ng-mf/components';

@Component({
  selector: 'app-supplier-detail',
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
  templateUrl: './supplier-detail.html',
  styleUrl: './supplier-detail.scss'
})
export class SupplierDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supplierApi = inject(SupplierApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  supplier = signal<Supplier | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplier(parseInt(id));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'suppliers',
          name: 'Suppliers',
          route: '/suppliers',
          type: 'link',
        },
        {
          id: 'supplier-details',
          name: `Supplier #${id}`,
          type: null,
        },
      ]);
    }
  }

  loadSupplier(id: number): void {
    this.isLoading.set(true);
    this.supplierApi.getById(id).subscribe({
      next: (supplier) => {
        this.supplier.set(supplier);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load supplier details');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/suppliers']);
  }

  editSupplier(): void {
    const supplier = this.supplier();
    if (supplier) {
      this.router.navigate(['/suppliers', supplier.id, 'edit']);
    }
  }

  viewLedger(): void {
    const supplier = this.supplier();
    if (supplier) {
      this.router.navigate(['/suppliers', supplier.id, 'ledger']);
    }
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      active: 'text-success bg-success/10',
      inactive: 'text-neutral bg-neutral/10',
      blocked: 'text-error bg-error/10',
    };
    return colorMap[status] || 'text-neutral bg-neutral/10';
  }
}
