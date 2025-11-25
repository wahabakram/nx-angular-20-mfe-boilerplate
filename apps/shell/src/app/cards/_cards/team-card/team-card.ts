import { Component, computed, input } from '@angular/core';
import { Dicebear } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-team-card',
  imports: [
    MatIcon,
    Dicebear
  ],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
  host: {
    'class': 'card-container'
  }
})
export class TeamCard {
  fullName = input.required();
  phone = input.required();
  email = input.required();
  description = input();
  avatarUrl = input('');

  readonly mailtoLink = computed(() => {
    return `mailto:${this.email()}`;
  });
  readonly telLink = computed(() => {
    return `tel:${this.phone()}`;
  });
}
