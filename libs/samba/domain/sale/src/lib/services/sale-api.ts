import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { CreateSaleDto, Sale, SalesSummary, UpdateSaleDto } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleApi {
  private apiService = inject(ApiService);
  private readonly endpoint = '/sales';

  getAll(): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(this.endpoint);
  }

  getById(id: number): Observable<Sale> {
    return this.apiService.get<Sale>(`${this.endpoint}/${id}`);
  }

  getByBranch(branchId: number): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  getByDateRange(branchId: number, fromDate: Date, toDate: Date): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(
      `${this.endpoint}?branchId=${branchId}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );
  }

  getTodaySales(branchId: number): Observable<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getByDateRange(branchId, today, tomorrow);
  }

  create(dto: CreateSaleDto): Observable<Sale> {
    return this.apiService.post<Sale>(this.endpoint, dto);
  }

  update(dto: UpdateSaleDto): Observable<Sale> {
    return this.apiService.put<Sale>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getSummary(branchId: number, fromDate: Date, toDate: Date): Observable<SalesSummary> {
    return this.apiService.get<SalesSummary>(
      `${this.endpoint}/summary?branchId=${branchId}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
    );
  }

  getUnsyncedSales(): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(`${this.endpoint}?synced=false`);
  }
}
