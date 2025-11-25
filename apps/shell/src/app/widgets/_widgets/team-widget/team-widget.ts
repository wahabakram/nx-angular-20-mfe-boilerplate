import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Avatar } from '@ng-mf/components';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-team-widget',
  imports: [
    MatIcon,
    MatIconButton,
    Avatar
  ],
  templateUrl: './team-widget.html',
  styleUrl: './team-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TeamWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
