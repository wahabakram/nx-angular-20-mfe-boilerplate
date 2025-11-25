import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-billing-status-cell',
  imports: [],
  templateUrl: './billing-status-cell.html',
  styleUrl: './billing-status-cell.scss'
})
export class BillingStatusCellComponent<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row(): any {
    return this.context.row;
  }
}
