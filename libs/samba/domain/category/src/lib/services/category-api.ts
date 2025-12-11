import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryApi {
  private apiService = inject(ApiService);
  private readonly endpoint = '/categories';

  getAll(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.endpoint);
  }

  getById(id: number): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  getActive(): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.endpoint}?isActive=true`);
  }

  create(dto: CreateCategoryDto): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, dto);
  }

  update(dto: UpdateCategoryDto): Observable<Category> {
    return this.apiService.put<Category>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getRootCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.endpoint}?parentId=null`);
  }

  getSubcategories(parentId: number): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.endpoint}?parentId=${parentId}`);
  }
}
