import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatCard, MatCardContent } from '@angular/material/card';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore } from '@ng-mf/components';

interface QuotationItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Quotation {
  id: number;
  quotationNumber: string;
  customerId: number;
  customerName: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdAt: string;
  createdBy: number;
}

@Component({
  selector: 'app-quotation-detail',
  standalone: true,
  imports: [RouterLink, MatButton, Icon, MatCard, MatCardContent, DatePipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './quotation-detail.html',
  styleUrl: './quotation-detail.scss'
})
export class QuotationDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  quotation = signal<Quotation | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isConverting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadQuotation(parseInt(id));
      
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
          id: 'quotations',
          name: 'Quotations',
          route: '/sales/quotations',
          type: 'link',
        },
        {
          id: 'quotation-detail',
          name: `Quotation #${id}`,
          type: null,
        },
      ]);
    }
  }

  loadQuotation(id: number): void {
    this.isLoading.set(true);
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockQuotation: Quotation = {
        id: id,
        quotationNumber: 'QUO-20240101-001',
        customerId: 1,
        customerName: 'Ali Ahmed',
        items: [
          {
            productId: 1,
            productName: 'LED TV 55 inch Samsung',
            quantity: 2,
            unitPrice: 45000,
            subtotal: 90000,
          },
          {
            productId: 3,
            productName: 'Split AC 1.5 Ton',
            quantity: 1,
            unitPrice: 35000,
            subtotal: 35000,
          },
        ],
        subtotal: 125000,
        taxAmount: 12500,
        totalAmount: 137500,
        validUntil: '2024-12-31T23:59:59.000Z',
        status: 'sent',
        notes: 'Special discount for bulk purchase',
        createdAt: '2024-12-01T10:00:00.000Z',
        createdBy: 1,
      };

      this.quotation.set(mockQuotation);
      this.isLoading.set(false);
    }, 500);
  }

  convertToSale(): void {
    const quotation = this.quotation();
    if (!quotation) return;

    if (quotation.status !== 'accepted') {
      if (!confirm('This quotation has not been accepted. Do you still want to convert it to a sale?')) {
        return;
      }
    }

    if (confirm(`Convert quotation ${quotation.quotationNumber} to sale?`)) {
      this.isConverting.set(true);
      
      // Mock conversion - replace with actual API call
      setTimeout(() => {
        console.log('Converting quotation to sale:', quotation);
        alert(`Quotation converted to sale successfully! Sale #: SALE-${quotation.id}`);
        this.router.navigate(['/sales']);
      }, 1000);
    }
  }

  updateStatus(status: Quotation['status']): void {
    const quotation = this.quotation();
    if (!quotation) return;

    if (confirm(`Update quotation status to "${status}"?`)) {
      // Mock status update - replace with actual API call
      this.quotation.set({ ...quotation, status });
      alert(`Status updated to "${status}"`);
    }
  }

  editQuotation(): void {
    const quotation = this.quotation();
    if (quotation) {
      this.router.navigate(['/sales/quotations', quotation.id, 'edit']);
    }
  }

  deleteQuotation(): void {
    const quotation = this.quotation();
    if (!quotation) return;

    if (confirm(`Are you sure you want to delete quotation ${quotation.quotationNumber}?`)) {
      // Mock deletion - replace with actual API call
      console.log('Deleting quotation:', quotation.id);
      alert('Quotation deleted successfully');
      this.router.navigate(['/sales/quotations']);
    }
  }

  printQuotation(): void {
    window.print();
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'expired': 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  isExpired(): boolean {
    const quotation = this.quotation();
    if (!quotation) return false;
    return new Date(quotation.validUntil) < new Date();
  }
}
