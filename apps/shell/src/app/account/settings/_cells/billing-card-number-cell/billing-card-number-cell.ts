import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-billing-card-number-cell',
  imports: [
    MatIcon
  ],
  templateUrl: './billing-card-number-cell.html',
  styleUrl: './billing-card-number-cell.scss'
})
export class BillingCardNumberCellComponent<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row(): any {
    return this.context.row;
  }
}
