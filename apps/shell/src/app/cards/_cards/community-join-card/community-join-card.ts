import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AvatarGroup, AvatarMore, Dicebear } from '@ng-mf/components';

export interface Community {
  name: string;
  description: string;
  memberCount: number;
  logo: {
    letter: string;
    gradient: string;
  };
  members: Member[];
}

export interface Member {
  id: any;
  name: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-community-join-card',
  imports: [
    MatButton,
    MatIcon,
    Dicebear,
    MatIconButton,
    AvatarGroup,
    AvatarMore
  ],
  templateUrl: './community-join-card.html',
  styleUrl: './community-join-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'card-container'
  }
})
export class CommunityJoinCard {
  community = input.required<Community>();

  readonly isFavorited = signal(false);

  readonly favoriteButtonAriaLabel = computed(() =>
    this.isFavorited() ? 'Remove from favorites' : 'Add to favorites'
  );

  toggleFavorite(): void {
    this.isFavorited.update(value => !value);
    console.log(`Favorite status: ${!this.isFavorited()}`);
  }
}
