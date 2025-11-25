import { Component } from '@angular/core';
import { OverlayScrollbar } from '../../../overlay-scrollbar';

@Component({
  selector: 'mf-sidebar-body',
  exportAs: 'mfSidebarBody',
  templateUrl: './sidebar-body.html',
  styleUrl: './sidebar-body.scss',
  imports: [
    OverlayScrollbar
  ],
  host: {
    'class': 'mf-sidebar-body'
  }
})
export class SidebarBody {

}
