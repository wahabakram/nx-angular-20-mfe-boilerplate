import { Component } from '@angular/core';
import { Dicebear } from '@ng-mf/components';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-user-cell',
  imports: [
    Dicebear
  ],
  templateUrl: './user-cell.html',
  styleUrl: './user-cell.scss'
})
export class UserCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();
}
