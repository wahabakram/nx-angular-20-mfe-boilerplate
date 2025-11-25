import { Component, computed, inject } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// App-specific imports
import { UserDataService } from '../user-data.service';
import { User, Follower } from '../user.model';
import { FollowerCard } from '../follower-card/follower-card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-overview',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FollowerCard,
    DecimalPipe,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private userDataService = inject(UserDataService);

  private userData = toSignal(this.userDataService.getUser());

  user = computed(() => this.userData());
  followers = computed(() => this.userData()?.followersList ?? []);

  searchControl = new FormControl('');
  private searchTerm = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  filteredFollowers = computed(() => {
    const term = this.searchTerm()?.toLowerCase() ?? '';
    if (!term) {
      return this.followers();
    }
    return this.followers().filter(f => f.name.toLowerCase().includes(term));
  });

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
        name: 'User Profile',
        type: null
      }
    ]);
  }

  handleToggleFollow(followerId: number): void {
    // this.userData.update((currentValue) => {
    //   if (!currentValue) return undefined;
    //
    //   const updatedFollowers = currentValue.followersList.map(follower =>
    //     follower.id === followerId
    //       ? { ...follower, isFollowed: !follower.isFollowed }
    //       : follower
    //   );
    //
    //   return { ...currentValue, followersList: updatedFollowers };
    // });
  }
}
