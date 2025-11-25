import { Component, inject, signal } from '@angular/core';
import { BreadcrumbsStore } from '@ng-mf/components';
import {
  Community,
  CommunityJoinCard
} from '@/cards/_cards/community-join-card/community-join-card';
import { TeamCard } from '@/cards/_cards/team-card/team-card';
import { UserLogoutCard } from '@/cards/_cards/user-logout-card/user-logout-card';
import { NYC_CODERS } from '@/cards/mock-data/users.mock';

@Component({
  selector: 'app-users',
  imports: [
    CommunityJoinCard,
    TeamCard,
    UserLogoutCard
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly nycCoders = signal<Community>(NYC_CODERS);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'cards',
        name: 'Cards',
        route: '/cards/general',
        type: 'link',
      },
      {
        id: 'users',
        name: 'Users',
        type: null
      }
    ]);
  }
}
