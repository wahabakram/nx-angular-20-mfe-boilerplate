import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-recent-activity-widget',
  imports: [],
  templateUrl: './recent-activity-widget.html',
  styleUrl: './recent-activity-widget.scss'
})
export class RecentActivityWidget implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
