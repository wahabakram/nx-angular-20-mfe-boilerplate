import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-cell',
  imports: [
    DatePipe
  ],
  templateUrl: './date-cell.html',
  styleUrl: './date-cell.scss'
})
export class DateCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row(): any {
    return this.context.row
  }
}
