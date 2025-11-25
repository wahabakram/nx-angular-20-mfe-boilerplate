import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Follower } from '../user.model';
import { Dicebear } from '@ng-mf/components';

@Component({
  selector: 'app-follower-card',
  imports: [
    MatButtonModule,
    MatIconModule,
    Dicebear
  ],
  templateUrl: './follower-card.html',
  styleUrl: './follower-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowerCard {
  follower = input.required<Follower>();
  readonly toggleFollow = output<number>();
}
