import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Client, CreateClientRequest, UpdateClientRequest, ClientStatistics } from '@invoicely/domain/client/models';

@Injectable({
  providedIn: 'root'
})
export class ClientApiService extends BaseApiService {
  private readonly endpoint = '/clients';

  // CRUD Operations
  getAll(): Observable<Client[]> {
    return this.get<Client[]>(this.endpoint);
  }

  getById(id: number): Observable<Client> {
    return this.get<Client>(`${this.endpoint}/${id}`);
  }

  create(data: CreateClientRequest): Observable<Client> {
    return this.post<Client>(this.endpoint, data);
  }

  update(id: number, data: UpdateClientRequest): Observable<Client> {
    return this.put<Client>(`${this.endpoint}/${id}`, data);
  }

  deleteClient(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  // Filtering & Search
  getActive(): Observable<Client[]> {
    return this.get<Client[]>(`${this.endpoint}/active`);
  }

  getInactive(): Observable<Client[]> {
    return this.get<Client[]>(`${this.endpoint}/inactive`);
  }

  search(query: string): Observable<Client[]> {
    return this.get<Client[]>(`${this.endpoint}/search?q=${query}`);
  }

  // Status Management
  activate(id: number): Observable<Client> {
    return this.patch<Client>(`${this.endpoint}/${id}/activate`, {});
  }

  deactivate(id: number): Observable<Client> {
    return this.patch<Client>(`${this.endpoint}/${id}/deactivate`, {});
  }

  // Additional Features
  getStatistics(): Observable<ClientStatistics> {
    return this.get<ClientStatistics>(`${this.endpoint}/statistics`);
  }

  getByTag(tagId: number): Observable<Client[]> {
    return this.get<Client[]>(`${this.endpoint}/tag/${tagId}`);
  }
}
