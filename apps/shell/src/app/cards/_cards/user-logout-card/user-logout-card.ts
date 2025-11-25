import { Component, input } from '@angular/core';
import { Dicebear } from '@ng-mf/components';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-logout-card',
  imports: [
    Dicebear,
    RouterLink,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './user-logout-card.html',
  styleUrl: './user-logout-card.scss',
  host: {
    'class': 'card-container'
  }
})
export class UserLogoutCard {
  userName = input.required<string>();
  userStatus = input.required<string>();
  avatarUrl = input<any>();
}
