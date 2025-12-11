import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CustomerLedgerEntry,
  CreateCustomerLedgerEntryDto,
  UpdateCustomerLedgerEntryDto,
  CustomerAccountSummary,
  LedgerQueryParams,
  LedgerResponse,
  SupplierLedgerEntry,
  CreateSupplierLedgerEntryDto,
  UpdateSupplierLedgerEntryDto,
  SupplierAccountSummary,
  SupplierLedgerQueryParams,
  SupplierLedgerResponse,
} from '../models/ledger.model';

@Injectable({ providedIn: 'root' })
export class LedgerApi {
  private http = inject(HttpClient);
  private readonly customerEndpoint = '/api/ledger/customer';
  private readonly supplierEndpoint = '/api/ledger/supplier';

  // ==================== Customer Ledger Methods ====================

  /**
   * Get ledger entries for a customer
   */
  getCustomerLedger(customerId: number, params?: LedgerQueryParams): Observable<LedgerResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof LedgerQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<LedgerResponse>(`${this.customerEndpoint}/${customerId}`, { params: httpParams });
  }

  /**
   * Get all customer ledger entries (admin view)
   */
  getAllEntries(params?: LedgerQueryParams): Observable<LedgerResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof LedgerQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<LedgerResponse>(`${this.customerEndpoint}`, { params: httpParams });
  }

  /**
   * Get customer account summary
   */
  getCustomerSummary(customerId: number): Observable<CustomerAccountSummary> {
    return this.http.get<CustomerAccountSummary>(`${this.customerEndpoint}/${customerId}/summary`);
  }

  /**
   * Get all customer summaries
   */
  getAllSummaries(): Observable<CustomerAccountSummary[]> {
    return this.http.get<CustomerAccountSummary[]>(`${this.customerEndpoint}/summaries`);
  }

  /**
   * Create a new customer ledger entry
   */
  createEntry(dto: CreateCustomerLedgerEntryDto): Observable<CustomerLedgerEntry> {
    return this.http.post<CustomerLedgerEntry>(`${this.customerEndpoint}`, dto);
  }

  /**
   * Update a customer ledger entry (admin only)
   */
  updateEntry(id: number, dto: UpdateCustomerLedgerEntryDto): Observable<CustomerLedgerEntry> {
    return this.http.put<CustomerLedgerEntry>(`${this.customerEndpoint}/${id}`, dto);
  }

  /**
   * Delete a customer ledger entry (admin only)
   */
  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.customerEndpoint}/${id}`);
  }

  /**
   * Record a customer payment
   */
  recordPayment(customerId: number, amount: number, description: string): Observable<CustomerLedgerEntry> {
    return this.http.post<CustomerLedgerEntry>(`${this.customerEndpoint}/${customerId}/payment`, {
      amount,
      description,
    });
  }

  /**
   * Issue a credit note to customer
   */
  issueCreditNote(customerId: number, amount: number, description: string): Observable<CustomerLedgerEntry> {
    return this.http.post<CustomerLedgerEntry>(`${this.customerEndpoint}/${customerId}/credit-note`, {
      amount,
      description,
    });
  }

  /**
   * Get customers with outstanding balances
   */
  getOutstandingBalances(): Observable<CustomerAccountSummary[]> {
    return this.http.get<CustomerAccountSummary[]>(`${this.customerEndpoint}/outstanding`);
  }

  // ==================== Supplier Ledger Methods ====================

  /**
   * Get ledger entries for a supplier
   */
  getSupplierLedger(supplierId: number, params?: SupplierLedgerQueryParams): Observable<SupplierLedgerResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof SupplierLedgerQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<SupplierLedgerResponse>(`${this.supplierEndpoint}/${supplierId}`, { params: httpParams });
  }

  /**
   * Get all supplier ledger entries (admin view)
   */
  getAllSupplierEntries(params?: SupplierLedgerQueryParams): Observable<SupplierLedgerResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof SupplierLedgerQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<SupplierLedgerResponse>(`${this.supplierEndpoint}`, { params: httpParams });
  }

  /**
   * Get supplier account summary
   */
  getSupplierSummary(supplierId: number): Observable<SupplierAccountSummary> {
    return this.http.get<SupplierAccountSummary>(`${this.supplierEndpoint}/${supplierId}/summary`);
  }

  /**
   * Get all supplier summaries
   */
  getAllSupplierSummaries(): Observable<SupplierAccountSummary[]> {
    return this.http.get<SupplierAccountSummary[]>(`${this.supplierEndpoint}/summaries`);
  }

  /**
   * Create a new supplier ledger entry
   */
  createSupplierEntry(dto: CreateSupplierLedgerEntryDto): Observable<SupplierLedgerEntry> {
    return this.http.post<SupplierLedgerEntry>(`${this.supplierEndpoint}`, dto);
  }

  /**
   * Update a supplier ledger entry (admin only)
   */
  updateSupplierEntry(id: number, dto: UpdateSupplierLedgerEntryDto): Observable<SupplierLedgerEntry> {
    return this.http.put<SupplierLedgerEntry>(`${this.supplierEndpoint}/${id}`, dto);
  }

  /**
   * Delete a supplier ledger entry (admin only)
   */
  deleteSupplierEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.supplierEndpoint}/${id}`);
  }

  /**
   * Record a payment to supplier
   */
  recordSupplierPayment(supplierId: number, amount: number, description: string): Observable<SupplierLedgerEntry> {
    return this.http.post<SupplierLedgerEntry>(`${this.supplierEndpoint}/${supplierId}/payment`, {
      amount,
      description,
    });
  }

  /**
   * Issue a credit note from supplier
   */
  issueSupplierCreditNote(supplierId: number, amount: number, description: string): Observable<SupplierLedgerEntry> {
    return this.http.post<SupplierLedgerEntry>(`${this.supplierEndpoint}/${supplierId}/credit-note`, {
      amount,
      description,
    });
  }

  /**
   * Get suppliers with outstanding payables
   */
  getSupplierPayables(): Observable<SupplierAccountSummary[]> {
    return this.http.get<SupplierAccountSummary[]>(`${this.supplierEndpoint}/payables`);
  }
}
