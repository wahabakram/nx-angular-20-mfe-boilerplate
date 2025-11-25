import { Component, computed, input } from '@angular/core';
import { AvatarGroup, AvatarMore, Dicebear } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

export interface Attendee {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-sprint-meeting-widget',
  imports: [AvatarGroup, Dicebear, AvatarMore, MatIcon, MatRipple],
  templateUrl: './sprint-meeting-widget.html',
  styleUrl: './sprint-meeting-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class SprintMeetingWidget {
  public readonly title = input.required<string>();
  public readonly timeRange = input.required<string>();
  public readonly attendees = input.required<Attendee[]>();
  public readonly maxVisibleAttendees = input<number>(3);

  public readonly visibleAttendees = computed<Attendee[]>(() =>
    this.attendees().slice(0, this.maxVisibleAttendees())
  );

  public readonly additionalAttendeesCount = computed(() => {
    const total = this.attendees().length;
    const visible = this.visibleAttendees().length;
    return Math.max(0, total - visible);
  });
}
