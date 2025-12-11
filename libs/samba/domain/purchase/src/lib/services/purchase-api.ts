import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  ReceivePurchaseDto,
  PurchaseQueryParams,
  PurchaseSummary,
  PurchaseReturn,
  CreatePurchaseReturnDto,
  PurchaseReturnQueryParams,
} from '../models/purchase.model';

/**
 * Purchase API Service
 * Handles all HTTP requests related to purchase orders
 */
@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  private http = inject(HttpClient);
  private readonly endpoint = '/api/purchases';

  /**
   * Get all purchases with optional filters
   */
  getAll(params?: PurchaseQueryParams): Observable<Purchase[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }

    return this.http.get<Purchase[]>(this.endpoint, { params: httpParams });
  }

  /**
   * Get a single purchase by ID
   */
  getById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new purchase order
   */
  create(dto: CreatePurchaseDto): Observable<Purchase> {
    return this.http.post<Purchase>(this.endpoint, dto);
  }

  /**
   * Update an existing purchase order
   */
  update(id: number, dto: UpdatePurchaseDto): Observable<Purchase> {
    return this.http.put<Purchase>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Delete a purchase order (soft delete)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Receive a purchase order (update inventory)
   */
  receive(dto: ReceivePurchaseDto): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.endpoint}/receive`, dto);
  }

  /**
   * Get purchases by supplier
   */
  getBySupplier(supplierId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.endpoint}/supplier/${supplierId}`);
  }

  /**
   * Get purchases by branch
   */
  getByBranch(branchId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.endpoint}/branch/${branchId}`);
  }

  /**
   * Get pending purchases (draft or ordered)
   */
  getPending(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.endpoint}/pending`);
  }

  /**
   * Get received purchases
   */
  getReceived(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.endpoint}/received`);
  }

  /**
   * Get purchase summary statistics
   */
  getSummary(): Observable<PurchaseSummary> {
    return this.http.get<PurchaseSummary>(`${this.endpoint}/summary`);
  }

  /**
   * Update purchase status
   */
  updateStatus(id: number, status: string): Observable<Purchase> {
    return this.http.patch<Purchase>(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Record payment for purchase
   */
  recordPayment(id: number, amount: number, paymentMethod: string): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.endpoint}/${id}/payment`, {
      amount,
      paymentMethod,
    });
  }

  // ==================== Purchase Returns ====================

  /**
   * Get all purchase returns with optional filters
   */
  getAllReturns(params?: PurchaseReturnQueryParams): Observable<PurchaseReturn[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }

    return this.http.get<PurchaseReturn[]>(`${this.endpoint}/returns`, { params: httpParams });
  }

  /**
   * Get a single purchase return by ID
   */
  getReturnById(id: number): Observable<PurchaseReturn> {
    return this.http.get<PurchaseReturn>(`${this.endpoint}/returns/${id}`);
  }

  /**
   * Create a new purchase return
   */
  createReturn(dto: CreatePurchaseReturnDto): Observable<PurchaseReturn> {
    return this.http.post<PurchaseReturn>(`${this.endpoint}/returns`, dto);
  }

  /**
   * Delete a purchase return
   */
  deleteReturn(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/returns/${id}`);
  }

  /**
   * Get purchase returns by supplier
   */
  getReturnsBySupplier(supplierId: number): Observable<PurchaseReturn[]> {
    return this.http.get<PurchaseReturn[]>(`${this.endpoint}/returns/supplier/${supplierId}`);
  }

  /**
   * Get pending purchase returns
   */
  getPendingReturns(): Observable<PurchaseReturn[]> {
    return this.http.get<PurchaseReturn[]>(`${this.endpoint}/returns/pending`);
  }

  /**
   * Process a purchase return (update inventory and ledger)
   */
  processReturn(id: number): Observable<PurchaseReturn> {
    return this.http.post<PurchaseReturn>(`${this.endpoint}/returns/${id}/process`, {});
  }
}
