import { Component, computed, input } from '@angular/core';
import { Attendee } from '@/widgets/_widgets/sprint-meeting-widget/sprint-meeting-widget';
import { AvatarGroup, AvatarMore, Dicebear } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-team-session-widget',
  imports: [
    AvatarGroup,
    AvatarMore,
    Dicebear,
    MatIcon,
    MatRipple,
  ],
  templateUrl: './team-session-widget.html',
  styleUrl: './team-session-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TeamSessionWidget {
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
