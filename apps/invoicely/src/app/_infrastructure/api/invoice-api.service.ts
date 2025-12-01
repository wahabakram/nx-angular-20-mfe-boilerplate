import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceStatistics,
} from '@invoicely/domain/invoice/models';

@Injectable({
  providedIn: 'root',
})
export class InvoiceApiService extends BaseApiService {
  private readonly endpoint = '/invoices';

  /**
   * Get all invoices
   */
  getAll(): Observable<Invoice[]> {
    return this.get<Invoice[]>(this.endpoint);
  }

  /**
   * Get invoice by ID
   */
  getById(id: number): Observable<Invoice> {
    return this.get<Invoice>(`${this.endpoint}/${id}`);
  }

  /**
   * Get invoices by status
   */
  getByStatus(status: string): Observable<Invoice[]> {
    return this.get<Invoice[]>(`${this.endpoint}/status/${status}`);
  }

  /**
   * Get invoices by client
   */
  getByClient(clientId: number): Observable<Invoice[]> {
    return this.get<Invoice[]>(`${this.endpoint}/client/${clientId}`);
  }

  /**
   * Search invoices
   */
  search(query: string): Observable<Invoice[]> {
    return this.get<Invoice[]>(`${this.endpoint}/search`);
  }

  /**
   * Get invoice statistics
   */
  getStatistics(): Observable<InvoiceStatistics> {
    return this.get<InvoiceStatistics>(`${this.endpoint}/statistics`);
  }

  /**
   * Create new invoice
   */
  create(data: CreateInvoiceRequest): Observable<Invoice> {
    return this.post<Invoice>(this.endpoint, data);
  }

  /**
   * Update invoice
   */
  update(id: number, data: UpdateInvoiceRequest): Observable<Invoice> {
    return this.put<Invoice>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Update invoice status
   */
  updateStatus(id: number, status: string): Observable<Invoice> {
    return this.patch<Invoice>(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Delete invoice
   */
  deleteInvoice(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Send invoice to client
   */
  send(id: number): Observable<Invoice> {
    return this.post<Invoice>(`${this.endpoint}/${id}/send`, {});
  }

  /**
   * Mark invoice as paid
   */
  markAsPaid(id: number): Observable<Invoice> {
    return this.post<Invoice>(`${this.endpoint}/${id}/mark-paid`, {});
  }

  /**
   * Generate PDF for invoice
   */
  generatePdf(id: number): Observable<Blob> {
    return this.get<Blob>(`${this.endpoint}/${id}/pdf`);
  }

  /**
   * Download PDF
   */
  downloadPdf(id: number, filename: string): void {
    this.generatePdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `invoice-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Failed to download PDF:', error);
      },
    });
  }

  /**
   * Duplicate invoice
   */
  duplicate(id: number): Observable<Invoice> {
    return this.post<Invoice>(`${this.endpoint}/${id}/duplicate`, {});
  }

  /**
   * Get recent invoices
   */
  getRecent(limit: number = 5): Observable<Invoice[]> {
    return this.get<Invoice[]>(`${this.endpoint}/recent`);
  }

  /**
   * Get overdue invoices
   */
  getOverdue(): Observable<Invoice[]> {
    return this.get<Invoice[]>(`${this.endpoint}/overdue`);
  }
}
