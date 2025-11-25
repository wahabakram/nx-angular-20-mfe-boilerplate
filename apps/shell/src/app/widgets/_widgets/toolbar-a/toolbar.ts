import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Dicebear } from '@ng-mf/components';

@Component({
  selector: 'app-sidebar-toolbar-a',
  imports: [
    MatIcon,
    MatButton,
    Dicebear
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class ToolbarA {

}
