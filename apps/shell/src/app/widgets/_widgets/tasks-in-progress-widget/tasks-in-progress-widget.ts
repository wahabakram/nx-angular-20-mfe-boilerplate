import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Avatar } from '@ng-mf/components';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-tasks-in-progress-widget',
  imports: [MatButton, MatIcon, MatIconButton, Avatar],
  templateUrl: './tasks-in-progress-widget.html',
  styleUrl: './tasks-in-progress-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class TasksInProgressWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
