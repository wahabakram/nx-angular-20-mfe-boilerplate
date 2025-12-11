import { Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-return-actions-cell',
  imports: [MatIconButton, MatTooltip, Icon],
  templateUrl: './return-actions-cell.html',
  styleUrl: './return-actions-cell.scss',
})
export class ReturnActionsCell {
  private router = inject(Router);

  row = input.required<any>();

  view(): void {
    this.router.navigate(['/sales/returns', this.row().id]);
  }

  printReceipt(): void {
    // TODO: Implement print receipt functionality
    console.log('Print receipt for return:', this.row().id);
  }
}
