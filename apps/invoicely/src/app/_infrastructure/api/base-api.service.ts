import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApiService {
  protected http = inject(HttpClient);
  protected baseUrl = environment.apiUrl;

  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }

  protected post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
