import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Avatar } from '@ng-mf/components';

@Component({
  selector: 'app-sidebar-upgrade-to-pro',
  exportAs: 'appSidebarUpgradeToPro',
  imports: [
    MatButton,
    MatIcon,
    Avatar
  ],
  templateUrl: './upgrade-to-pro.html',
  styleUrl: './upgrade-to-pro.scss'
})
export class UpgradeToPro {

}
