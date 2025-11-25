import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-plan-name-cell',
  imports: [
    CurrencyPipe,
  ],
  templateUrl: './plan-name-cell.html',
  styleUrl: './plan-name-cell.scss'
})
export class PlanNameCellComponent<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row(): any {
    return this.context.row;
  }
}
