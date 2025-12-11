import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-sales-actions-cell',
  imports: [MatIconButton, Icon],
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
