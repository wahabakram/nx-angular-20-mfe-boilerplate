import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { CreateProductDto, Product, UpdateProductDto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductApi {
  private apiService = inject(ApiService);
  private readonly endpoint = '/products';

  getAll(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.endpoint);
  }

  getById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  getByBranch(branchId: number): Observable<Product[]> {
    return this.apiService.get<Product[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.apiService.post<Product>(this.endpoint, dto);
  }

  update(dto: UpdateProductDto): Observable<Product> {
    return this.apiService.put<Product>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchByBarcode(barcode: string): Observable<Product | null> {
    return this.apiService.get<Product | null>(`${this.endpoint}/barcode/${barcode}`);
  }

  getLowStockProducts(branchId?: number): Observable<Product[]> {
    const url = branchId
      ? `${this.endpoint}/low-stock?branchId=${branchId}`
      : `${this.endpoint}/low-stock`;
    return this.apiService.get<Product[]>(url);
  }
}
