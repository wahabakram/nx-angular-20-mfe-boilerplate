import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { CreateCustomerDto, Customer, UpdateCustomerDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerApi {
  private apiService = inject(ApiService);
  private readonly endpoint = '/customers';

  getAll(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(this.endpoint);
  }

  getById(id: number): Observable<Customer> {
    return this.apiService.get<Customer>(`${this.endpoint}/${id}`);
  }

  getActive(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}?isActive=true`);
  }

  create(dto: CreateCustomerDto): Observable<Customer> {
    return this.apiService.post<Customer>(this.endpoint, dto);
  }

  update(dto: UpdateCustomerDto): Observable<Customer> {
    return this.apiService.put<Customer>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchByPhone(phone: string): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}?phone=${phone}`);
  }

  getCustomersWithBalance(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>(`${this.endpoint}?hasBalance=true`);
  }
}
