import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-access-cell',
  imports: [],
  templateUrl: './access-cell.html',
  styleUrl: './access-cell.scss'
})
export class AccessCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row(): any {
    return this.context.row
  }
}
