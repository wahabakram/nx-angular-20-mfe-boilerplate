import { Component, EventEmitter, inject, input } from '@angular/core';
import {
  PanelBody,
  Panel,
  PanelFooter,
  PanelHeader
} from '@ng-mf/components';
import { WIDGET_SETTINGS_UPDATED } from '@/dashboard/dynamic/types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DRAWER } from '@ng-mf/components';

@Component({
  selector: 'app-total-projects-settings',
  imports: [
    PanelBody,
    Panel,
    PanelHeader,
    FormsModule,
    MatButton,
    MatIcon,
    MatIconButton,
    PanelFooter,
    ReactiveFormsModule
  ],
  templateUrl: './total-projects-settings.html',
  styleUrl: './total-projects-settings.scss'
})
export class TotalProjectsSettings {
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
