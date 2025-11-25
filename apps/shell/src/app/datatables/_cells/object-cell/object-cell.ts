import { Component } from '@angular/core';
import { Dicebear } from '@ng-mf/components';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-object-cell',
  imports: [
    Dicebear
  ],
  templateUrl: './object-cell.html',
  styleUrl: './object-cell.scss'
})
export class ObjectCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();
}
