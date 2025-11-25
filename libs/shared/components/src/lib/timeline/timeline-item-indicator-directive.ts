import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
    selector: '[mfTimelineItemIndicator]',
    exportAs: 'mfTimelineItemIndicator',
})
export class TimelineItemIndicatorDirective {
  readonly templateRef = inject(TemplateRef);
}
