import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@samba/infrastructure';
import { Branch, CreateBranchDto, UpdateBranchDto } from '../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/branches';

  getAll(): Observable<Branch[]> {
    return this.apiService.get<Branch[]>(this.endpoint);
  }

  getById(id: number): Observable<Branch> {
    return this.apiService.get<Branch>(`${this.endpoint}/${id}`);
  }

  getActive(): Observable<Branch[]> {
    return this.apiService.get<Branch[]>(`${this.endpoint}?isActive=true`);
  }

  create(dto: CreateBranchDto): Observable<Branch> {
    return this.apiService.post<Branch>(this.endpoint, dto);
  }

  update(dto: UpdateBranchDto): Observable<Branch> {
    return this.apiService.put<Branch>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getMainBranch(): Observable<Branch> {
    return this.apiService.get<Branch>(`${this.endpoint}?isMainBranch=true`);
  }
}
