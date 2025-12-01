import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  Panel,
  PanelBody,
  PanelHeader,
  ConfirmManager,
  HorizontalDivider,
} from '@ng-mf/components';
import { InvoiceStore } from '@invoicely/domain/invoice/store';
import { InvoiceApiService } from '@invoicely/infrastructure/api';
import { Invoice, InvoiceStatus } from '@invoicely/domain/invoice/models';

@Component({
  selector: 'app-invoice-detail',
  imports: [
    CommonModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    Panel,
    PanelBody,
    PanelHeader,
    HorizontalDivider,
  ],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.scss',
})
export class InvoiceDetail implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  invoiceStore = inject(InvoiceStore);
  private invoiceApi = inject(InvoiceApiService);
  private confirmManager = inject(ConfirmManager);

  invoice = signal<Invoice | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    this.loadInvoice();
  }

  loadInvoice(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/invoices']);
      return;
    }

    this.loading.set(true);

    this.invoiceApi.getById(+id).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load invoice:', error);
        this.loading.set(false);
        this.router.navigate(['/invoices']);
      },
    });
  }

  getStatusClass(status: InvoiceStatus): string {
    const classes: Record<InvoiceStatus, string> = {
      draft: 'status-badge status-draft',
      sent: 'status-badge status-sent',
      paid: 'status-badge status-paid',
      overdue: 'status-badge status-overdue',
      cancelled: 'status-badge status-cancelled',
    };
    return classes[status];
  }

  getStatusLabel(status: InvoiceStatus): string {
    const labels: Record<InvoiceStatus, string> = {
      draft: 'Draft',
      sent: 'Sent',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
    };
    return labels[status];
  }

  editInvoice(): void {
    if (this.invoice()) {
      this.router.navigate(['/invoices', this.invoice()!.id, 'edit']);
    }
  }

  deleteInvoice(): void {
    const currentInvoice = this.invoice();
    if (!currentInvoice) return;

    const confirmRef = this.confirmManager.open({
      title: 'Delete Invoice',
      description: `Are you sure you want to delete invoice ${currentInvoice.invoiceNumber}?`,
    });

    confirmRef.confirmed.subscribe(() => {
      this.invoiceApi.deleteInvoice(currentInvoice.id).subscribe({
        next: () => {
          this.invoiceStore.deleteInvoice(currentInvoice.id);
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          console.error('Failed to delete invoice:', error);
        },
      });
    });
  }

  sendInvoice(): void {
    const currentInvoice = this.invoice();
    if (!currentInvoice) return;

    this.loading.set(true);

    this.invoiceApi.send(currentInvoice.id).subscribe({
      next: (updatedInvoice) => {
        this.invoice.set(updatedInvoice);
        this.invoiceStore.updateInvoice(currentInvoice.id, updatedInvoice);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to send invoice:', error);
        this.loading.set(false);
      },
    });
  }

  markAsPaid(): void {
    const currentInvoice = this.invoice();
    if (!currentInvoice) return;

    this.loading.set(true);

    this.invoiceApi.markAsPaid(currentInvoice.id).subscribe({
      next: (updatedInvoice) => {
        this.invoice.set(updatedInvoice);
        this.invoiceStore.updateInvoice(currentInvoice.id, updatedInvoice);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to mark invoice as paid:', error);
        this.loading.set(false);
      },
    });
  }

  downloadPdf(): void {
    const currentInvoice = this.invoice();
    if (!currentInvoice) return;

    this.invoiceApi.downloadPdf(currentInvoice.id, `invoice-${currentInvoice.invoiceNumber}.pdf`);
  }

  duplicateInvoice(): void {
    const currentInvoice = this.invoice();
    if (!currentInvoice) return;

    this.loading.set(true);

    this.invoiceApi.duplicate(currentInvoice.id).subscribe({
      next: (newInvoice) => {
        this.invoiceStore.addInvoice(newInvoice);
        this.loading.set(false);
        this.router.navigate(['/invoices', newInvoice.id, 'edit']);
      },
      error: (error) => {
        console.error('Failed to duplicate invoice:', error);
        this.loading.set(false);
      },
    });
  }

  backToInvoices(): void {
    this.router.navigate(['/invoices']);
  }

  printInvoice(): void {
    window.print();
  }
}
