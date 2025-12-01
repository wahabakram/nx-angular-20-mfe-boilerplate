import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  DataView,
  DataViewActionBarDirective,
  DataViewActionBar,
  DataViewCellRenderer,
  DataViewColumnDef,
  DataViewEmptyDataDirective,
  DataViewEmptyFilterResultsDirective,
  DataViewRowSelectionEvent,
  BlockState,
  BlockStateContent,
  BlockStateIcon,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  VerticalDivider,
  Segmented,
  SegmentedButton,
  ConfirmManager,
} from '@ng-mf/components';
import { InvoiceStore } from '@invoicely/domain/invoice/store';
import { InvoiceApiService } from '@invoicely/infrastructure/api';
import { Invoice, InvoiceStatus } from '@invoicely/domain/invoice/models';

@Component({
  selector: 'app-invoice-list',
  imports: [
    FormsModule,
    MatPaginator,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatCardModule,
    DataView,
    DataViewActionBar,
    DataViewActionBarDirective,
    DataViewEmptyDataDirective,
    DataViewEmptyFilterResultsDirective,
    BlockState,
    BlockStateContent,
    BlockStateIcon,
    Panel,
    PanelBody,
    PanelFooter,
    PanelHeader,
    VerticalDivider,
    Segmented,
    SegmentedButton,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList implements OnInit {
  invoiceStore = inject(InvoiceStore);
  private invoiceApi = inject(InvoiceApiService);
  private router = inject(Router);
  private confirmManager = inject(ConfirmManager);

  status = signal<InvoiceStatus | 'all'>('all');
  search = signal('');
  selectedRows = signal<Invoice[]>([]);
  currentActionRow = signal<Invoice | null>(null);

  columnDefs: DataViewColumnDef[] = [
    {
      name: 'Id',
      dataField: 'id',
      visible: false,
    },
    {
      name: 'Invoice #',
      dataField: 'invoiceNumber',
      visible: true,
    },
    {
      name: 'Client',
      dataField: 'client.name',
      visible: true,
    },
    {
      name: 'Issue Date',
      dataField: 'issueDate',
      visible: true,
    },
    {
      name: 'Due Date',
      dataField: 'dueDate',
      visible: true,
    },
    {
      name: 'Amount',
      dataField: 'total',
      visible: true,
    },
    {
      name: 'Status',
      dataField: 'status',
      visible: true,
    },
  ];

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceStore.setLoading(true);
    this.invoiceApi.getAll().subscribe({
      next: (invoices) => {
        this.invoiceStore.setInvoices(invoices);
        this.invoiceStore.setLoading(false);
      },
      error: (error) => {
        this.invoiceStore.setError('Failed to load invoices');
        console.error('Failed to load invoices:', error);
      },
    });
  }

  get filteredData(): Invoice[] {
    const currentStatus = this.status();
    const searchQuery = this.search();

    return this.invoiceStore.filteredInvoices().filter((invoice) => {
      // Status filter
      if (currentStatus !== 'all' && invoice.status !== currentStatus) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(query) ||
          invoice.client?.name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }

  onStatusChange(newStatus: InvoiceStatus | 'all'): void {
    this.status.set(newStatus);
  }

  rowSelectionChanged(event: DataViewRowSelectionEvent<Invoice>): void {
    if (event.checked) {
      this.selectedRows.update((rows) => [...rows, event.row]);
    } else {
      this.selectedRows.update((rows) => rows.filter((r) => r.id !== event.row.id));
    }
  }

  selectionChanged(rows: Invoice[]): void {
    this.selectedRows.set(rows);
  }

  allRowsSelectionChanged(selected: boolean): void {
    if (selected) {
      this.selectedRows.set([...this.filteredData]);
    } else {
      this.selectedRows.set([]);
    }
  }

  createInvoice(): void {
    this.router.navigate(['/invoices/create']);
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id]);
  }

  editInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.id, 'edit']);
  }

  deleteInvoice(invoice: Invoice): void {
    const confirmRef = this.confirmManager.open({
      title: 'Delete Invoice',
      description: `Are you sure you want to delete invoice ${invoice.invoiceNumber}?`,
    });

    confirmRef.confirmed.subscribe(() => {
      this.invoiceApi.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.invoiceStore.deleteInvoice(invoice.id);
        },
        error: (error) => {
          console.error('Failed to delete invoice:', error);
        },
      });
    });
  }

  sendInvoice(invoice: Invoice): void {
    this.invoiceApi.send(invoice.id).subscribe({
      next: (updatedInvoice) => {
        this.invoiceStore.updateInvoice(invoice.id, updatedInvoice);
      },
      error: (error) => {
        console.error('Failed to send invoice:', error);
      },
    });
  }

  markAsPaid(invoice: Invoice): void {
    this.invoiceApi.markAsPaid(invoice.id).subscribe({
      next: (updatedInvoice) => {
        this.invoiceStore.updateInvoice(invoice.id, updatedInvoice);
      },
      error: (error) => {
        console.error('Failed to mark invoice as paid:', error);
      },
    });
  }

  downloadPdf(invoice: Invoice): void {
    this.invoiceApi.downloadPdf(invoice.id, `invoice-${invoice.invoiceNumber}.pdf`);
  }

  deleteSelected(): void {
    const count = this.selectedRows().length;
    const confirmRef = this.confirmManager.open({
      title: 'Delete Invoices',
      description: `Are you sure you want to delete ${count} invoice(s)?`,
    });

    confirmRef.confirmed.subscribe(() => {
      // Delete all selected invoices
      this.selectedRows().forEach((invoice) => {
        this.invoiceApi.deleteInvoice(invoice.id).subscribe({
          next: () => {
            this.invoiceStore.deleteInvoice(invoice.id);
          },
        });
      });
      this.selectedRows.set([]);
    });
  }
}
