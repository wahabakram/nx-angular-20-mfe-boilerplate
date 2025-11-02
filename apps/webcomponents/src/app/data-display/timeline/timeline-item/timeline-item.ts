import { Component, contentChild, TemplateRef } from '@angular/core';
import { TimelineItemIndicatorDirective } from '../timeline-item-indicator-directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mfc-timeline-item',
  exportAs: 'mfcTimelineItem',
  templateUrl: './timeline-item.html',
  styleUrl: './timeline-item.scss',
  host: {
    'class': 'mfc-timeline-item'
  },
  imports: [NgTemplateOutlet]
})
export class TimelineItem {
  readonly indicatorRef = contentChild(TimelineItemIndicatorDirective);

  get indicatorTemplateRef() {
    return this.indicatorRef()?.templateRef as TemplateRef<any>;
  }
}
