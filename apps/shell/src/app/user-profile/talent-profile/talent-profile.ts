import { Component, inject, signal } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Icon } from '@ng-mf/components';
import { Avatar } from '@ng-mf/components';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Language, Person, Skill, TALENT_LANGUAGES, TALENT_PEOPLE_ALSO_VIEWED, TALENT_SKILLS } from '../mock-data/talent-profile.mock';

@Component({
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatTooltip,
    Icon,
    MatAnchor,
    Avatar,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader
  ],
  templateUrl: './talent-profile.html',
  styleUrl: './talent-profile.scss'
})
export class TalentProfile {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  followed = signal<boolean>(false);
  peopleAlsoViewed = signal<Person[]>(TALENT_PEOPLE_ALSO_VIEWED);
  languages = signal<Language[]>(TALENT_LANGUAGES);
  skills = signal<Skill[]>(TALENT_SKILLS);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/notifications',
        type: 'link',
      },
      {
        id: 'talent-profile',
        name: 'Talent Profile',
        type: null
      }
    ]);
  }

  follow(): void {
    this.followed.set(true);
  }

  unfollow(): void {
    this.followed.set(false);
  }
}
