import { Component, input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'mf-side-panel-tab',
  exportAs: 'mfSidePanelTab',
  templateUrl: './side-panel-tab.html',
  styleUrl: './side-panel-tab.scss',
  host: {
    class: 'mf-side-panel-tab',
  },
})
export class SidePanelTab {
  tabId = input.required<string>();
  label = input.required<string>();
  icon = input<string | TemplateRef<any> | undefined>();

  @ViewChild('contentTemplate', { read: TemplateRef, static: true })
  content!: TemplateRef<any>;
}
