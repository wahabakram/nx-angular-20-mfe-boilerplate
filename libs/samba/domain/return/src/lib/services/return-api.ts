import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import {
  CreateReturnDto,
  Return,
  ReturnQueryParams,
  ReturnSummary,
  UpdateReturnDto
} from '../models/return.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnApi {
  private apiService = inject(ApiService);
  private readonly endpoint = '/returns';

  getAll(params?: ReturnQueryParams): Observable<Return[]> {
    const queryString = this.buildQueryString(params);
    return this.apiService.get<Return[]>(`${this.endpoint}${queryString}`);
  }

  getById(id: number): Observable<Return> {
    return this.apiService.get<Return>(`${this.endpoint}/${id}`);
  }

  getByBranch(branchId: number): Observable<Return[]> {
    return this.apiService.get<Return[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  getByCustomer(customerId: number): Observable<Return[]> {
    return this.apiService.get<Return[]>(`${this.endpoint}?customerId=${customerId}`);
  }

  getBySale(saleId: number): Observable<Return[]> {
    return this.apiService.get<Return[]>(`${this.endpoint}?saleId=${saleId}`);
  }

  getByDateRange(branchId: number, fromDate: Date, toDate: Date): Observable<Return[]> {
    return this.apiService.get<Return[]>(
      `${this.endpoint}?branchId=${branchId}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );
  }

  create(dto: CreateReturnDto): Observable<Return> {
    return this.apiService.post<Return>(this.endpoint, dto);
  }

  update(dto: UpdateReturnDto): Observable<Return> {
    return this.apiService.put<Return>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getSummary(branchId: number, fromDate: Date, toDate: Date): Observable<ReturnSummary> {
    return this.apiService.get<ReturnSummary>(
      `${this.endpoint}/summary?branchId=${branchId}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );
  }

  getReturnableSaleItems(saleId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`/sales/${saleId}/returnable-items`);
  }

  private buildQueryString(params?: ReturnQueryParams): string {
    if (!params) return '';

    const query = new URLSearchParams();

    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.customerId) query.append('customerId', params.customerId.toString());
    if (params.branchId) query.append('branchId', params.branchId.toString());
    if (params.status) query.append('status', params.status);
    if (params.refundMethod) query.append('refundMethod', params.refundMethod);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    return query.toString() ? `?${query.toString()}` : '';
  }
}
