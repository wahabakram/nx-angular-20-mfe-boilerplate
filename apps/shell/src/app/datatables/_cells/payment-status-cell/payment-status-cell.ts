import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-payment-status-cell',
  imports: [],
  templateUrl: './payment-status-cell.html',
  styleUrl: './payment-status-cell.scss'
})
export class PaymentStatusCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();
}
