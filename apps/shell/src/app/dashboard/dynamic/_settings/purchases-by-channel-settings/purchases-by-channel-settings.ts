import { Component, EventEmitter, inject, input, OnInit } from '@angular/core';
import {
  PanelBody,
  Panel,
  PanelFooter,
  PanelHeader
} from '@ng-mf/components';
import { WIDGET_SETTINGS_UPDATED } from '@/dashboard/dynamic/types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DRAWER } from '@ng-mf/components';

@Component({
  selector: 'app-purchases-by-channel-settings',
  imports: [
    PanelBody,
    Panel,
    PanelHeader,
    MatLabel,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
    MatButton,
    PanelFooter
  ],
  templateUrl: './purchases-by-channel-settings.html',
  styleUrl: './purchases-by-channel-settings.scss'
})
export class PurchasesByChannelSettings implements OnInit {
  private drawer = inject<any>(DRAWER);
  private widgetSettingsUpdated = inject<EventEmitter<any>>(WIDGET_SETTINGS_UPDATED);
  private formBuilder = inject(FormBuilder);

  readonly data = input.required<any>();

  protected form = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit() {
    this.form.setValue(this.data());
  }

  close() {
    this.drawer.close();
  }

  save() {
    this.widgetSettingsUpdated.emit(this.form.value);
    this.close();
  }
}
