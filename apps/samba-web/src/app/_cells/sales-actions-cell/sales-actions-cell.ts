import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-actions-cell',
  imports: [MatIconButton, MatIcon],
  templateUrl: './sales-actions-cell.html',
  styleUrl: './sales-actions-cell.scss',
})
export class SalesActionsCell {
  private router = inject(Router);

  row = input.required<any>();

  view(): void {
    this.router.navigate(['/quotations', this.row().id]);
  }
}
