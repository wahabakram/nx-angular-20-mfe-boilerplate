import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-currency-cell',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './currency-cell.html',
  styleUrl: './currency-cell.scss'
})
export class CurrencyCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();
}
