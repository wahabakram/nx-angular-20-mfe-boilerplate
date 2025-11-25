import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dv-date-renderer',
    imports: [
        DatePipe
    ],
    templateUrl: './dv-date-renderer.html',
    styleUrl: './dv-date-renderer.scss'
})
export class DvDateRenderer {
  @Input()
  element: any;

  @Input()
  columnDef: any;

  @Input()
  fieldData: any;
}
