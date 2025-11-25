import { Component, EventEmitter, inject, input } from '@angular/core';
import {
  PanelBody,
  Panel,
  PanelFooter,
  PanelHeader
} from '@ng-mf/components';
import { WIDGET_SETTINGS_UPDATED } from '@/dashboard/dynamic/types';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DRAWER } from '@ng-mf/components';

@Component({
  selector: 'app-total-tasks-settings',
  imports: [
    Panel,
    PanelHeader,
    PanelBody,
    MatButton,
    MatIconButton,
    PanelFooter,
    MatIcon
  ],
  templateUrl: './total-tasks-settings.html',
  styleUrl: './total-tasks-settings.scss'
})
export class TotalTasksSettings {
  private drawer = inject<any>(DRAWER);
  private widgetSettingsUpdated = inject<EventEmitter<any>>(WIDGET_SETTINGS_UPDATED);

  readonly data = input.required<any>();

  close() {
    this.drawer.close();
  }

  save() {
    this.widgetSettingsUpdated.emit({});
    this.close();
  }
}
