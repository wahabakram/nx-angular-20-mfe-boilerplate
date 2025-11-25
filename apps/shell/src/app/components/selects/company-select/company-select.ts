import { Component, effect, input, output, signal } from '@angular/core';
import { Dicebear } from '@ng-mf/components';
import { HorizontalDivider } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-company-select',
  imports: [
    Dicebear,
    HorizontalDivider,
    MatButton,
    MatIcon,
    MatMenu,
    MatRipple,
    MatMenuTrigger
  ],
  templateUrl: './company-select.html',
  styleUrl: './company-select.scss'
})
export class CompanySelect {
  companies = input<any[]>([]);
  selectedCompany = input();
  triggerText = input.required();
  createNewText = input.required();
  emptyText = input.required();
  protected _selectedCompany = signal<any>(null);

  readonly companySelected = output<any>();
  readonly companyCreateNew = output<void>();

  constructor() {
    effect(() => {
      this._selectedCompany.set(this.selectedCompany());
    });
  }

  selectCompany(company: any) {
    if (this._selectedCompany()?.id === company.id) {
      return;
    }

    this._selectedCompany.set(company);
    this.companySelected.emit(company);
  }

  createNew() {
    this.companyCreateNew.emit();
  }
}
