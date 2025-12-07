import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-actions-cell',
  imports: [MatIconButton, MatIcon],
  templateUrl: './quotation-actions-cell.html',
  styleUrl: './quotation-actions-cell.scss',
})
export class QuotationActionsCell {
  private router = inject(Router);

  row = input.required<any>();

  edit(): void {
    console.log('Edit user:', this.row().id);
    // Navigate to edit page when implemented
    // this.router.navigate(['/settings/users/edit', this.row().id]);
  }

  view(): void {
    this.router.navigate(['/quotations', this.row().id]);
  }
}
