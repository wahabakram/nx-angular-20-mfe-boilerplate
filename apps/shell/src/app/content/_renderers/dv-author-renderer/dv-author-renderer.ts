import { Component, Input } from '@angular/core';
import { InitialsPipe } from '@ng-mf/components';
import { Avatar } from '@ng-mf/components';

@Component({
  selector: 'app-dv-author-renderer',
  imports: [
    InitialsPipe,
    Avatar
  ],
  templateUrl: './dv-author-renderer.html',
  styleUrl: './dv-author-renderer.scss'
})
export class DvAuthorRenderer {
  @Input()
  element: any;

  @Input()
  columnDef: any;

  @Input()
  fieldData: any;
}
