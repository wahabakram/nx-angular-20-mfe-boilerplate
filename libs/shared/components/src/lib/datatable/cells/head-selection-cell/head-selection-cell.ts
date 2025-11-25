import { Component } from '@angular/core';
import { HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'mf-head-selection-cell',
  imports: [
    MatCheckbox
  ],
  templateUrl: './head-selection-cell.html',
  styleUrl: './head-selection-cell.scss'
})
export class HeadSelectionCell<T> {
  context = injectFlexRenderContext<HeaderContext<T, unknown>>()
}
