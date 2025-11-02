import { Component, input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'mfc-side-panel-tab',
  exportAs: 'mfcSidePanelTab',
  templateUrl: './side-panel-tab.html',
  styleUrl: './side-panel-tab.scss',
  host: {
    class: 'mfc-side-panel-tab',
  },
})
export class SidePanelTab {
  tabId = input.required<string>();
  label = input.required<string>();
  icon = input<string | TemplateRef<any> | undefined>();

  @ViewChild('contentTemplate', { read: TemplateRef, static: true })
  content!: TemplateRef<any>;
}
