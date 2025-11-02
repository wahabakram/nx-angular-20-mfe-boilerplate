import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
    selector: '[mfcTimelineItemIndicator]',
    exportAs: 'mfcTimelineItemIndicator',
})
export class TimelineItemIndicatorDirective {
  readonly templateRef = inject(TemplateRef);
}
