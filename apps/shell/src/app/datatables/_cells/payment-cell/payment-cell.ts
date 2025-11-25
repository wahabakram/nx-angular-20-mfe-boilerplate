import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-payment-cell',
  imports: [
  ],
  templateUrl: './payment-cell.html',
  styleUrl: './payment-cell.scss'
})
export class PaymentCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();
}
