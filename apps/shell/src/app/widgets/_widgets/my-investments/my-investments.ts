import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatList, MatListItem } from '@angular/material/list';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-my-investments',
  imports: [MatIcon, MatRipple, RouterLink, MatListItem, MatList],
  templateUrl: './my-investments.html',
  styleUrl: './my-investments.scss',
  host: {
    class: 'widget-container',
  },
})
export class MyInvestments implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
