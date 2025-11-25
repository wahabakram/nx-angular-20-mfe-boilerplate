import { Component, inject, input, OnInit } from '@angular/core';
import { Avatar, AvatarGroup, AvatarTotal } from '@ng-mf/components';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-events-widget',
  templateUrl: './events-widget.html',
  imports: [
    AvatarGroup,
    Avatar,
    AvatarTotal
  ],
  styleUrl: './events-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class EventsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
