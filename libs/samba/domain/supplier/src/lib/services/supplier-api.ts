import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierQueryParams,
  SupplierSummary,
} from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierApi {
  private http = inject(HttpClient);
  private readonly endpoint = '/api/suppliers';

  /**
   * Get all suppliers with optional filters
   */
  getAll(params?: SupplierQueryParams): Observable<Supplier[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key as keyof SupplierQueryParams];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.append(key, value.toString());
        }
      });
    }
    return this.http.get<Supplier[]>(this.endpoint, { params: httpParams });
  }

  /**
   * Get supplier by ID
   */
  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new supplier
   */
  create(dto: CreateSupplierDto): Observable<Supplier> {
    return this.http.post<Supplier>(this.endpoint, dto);
  }

  /**
   * Update existing supplier
   */
  update(id: number, dto: UpdateSupplierDto): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Delete supplier
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Get supplier balance (amount we owe)
   */
  getBalance(id: number): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.endpoint}/${id}/balance`);
  }

  /**
   * Get suppliers with outstanding payables
   */
  getWithPayables(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.endpoint}/payables`);
  }

  /**
   * Get supplier summary statistics
   */
  getSummary(): Observable<SupplierSummary> {
    return this.http.get<SupplierSummary>(`${this.endpoint}/summary`);
  }
}
