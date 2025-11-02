import { Component } from '@angular/core';
import { OverlayScrollbar } from '../../../utilities/overlay-scrollbar';

@Component({
  selector: 'mfc-sidebar-body',
  exportAs: 'mfcSidebarBody',
  templateUrl: './sidebar-body.html',
  styleUrl: './sidebar-body.scss',
  imports: [
    OverlayScrollbar
  ],
  host: {
    'class': 'mfc-sidebar-body'
  }
})
export class SidebarBody {

}
