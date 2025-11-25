import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Gauge } from '@ng-mf/components';

@Component({
  selector: 'app-used-space',
  imports: [
    Gauge,
    MatIcon
  ],
  templateUrl: './used-space.html',
  styleUrl: './used-space.scss'
})
export class UsedSpace {

}
