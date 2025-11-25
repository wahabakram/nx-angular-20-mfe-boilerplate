import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from './user.model';

// providedIn: 'root' makes it a singleton without NgModules
@Injectable({ providedIn: 'root' })
export class UserDataService {
  private readonly mockUser: User = {
    name: 'Mike Nielsen',
    title: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=11',
    banner: 'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1600&auto=format&fit=crop',
    stats: { posts: 938, followers: 3586, following: 2659 },
    followersList: [
      { id: 1, name: 'Betty Adams', location: 'Sint Maarten', avatar: 'https://i.pravatar.cc/150?img=1', isFollowed: false },
      { id: 2, name: 'Virginia Wong', location: 'Tunisia', avatar: 'https://i.pravatar.cc/150?img=2', isFollowed: false },
      { id: 3, name: 'Birdie', location: 'Algeria', avatar: 'https://i.pravatar.cc/150?img=3', isFollowed: true },
      { id: 4, name: 'Steven', location: 'Malaysia', avatar: 'https://i.pravatar.cc/150?img=4', isFollowed: true },
      { id: 5, name: 'Hannah', location: 'Grenada', avatar: 'https://i.pravatar.cc/150?img=5', isFollowed: true },
      { id: 6, name: 'Effie Gross', location: 'Azerbaijan', avatar: 'https://i.pravatar.cc/150?img=6', isFollowed: false },
      { id: 7, name: 'Barton', location: 'French Southern Territories', avatar: 'https://i.pravatar.cc/150?img=7', isFollowed: false },
      { id: 8, name: 'Carolyn', location: 'Nauru', avatar: 'https://i.pravatar.cc/150?img=8', isFollowed: true },
      { id: 9, name: 'Elizabeth', location: 'Djibouti', avatar: 'https://i.pravatar.cc/150?img=9', isFollowed: false },
    ],
  };

  getUser(): Observable<User> {
    // Simulate a network request
    return of(this.mockUser).pipe(delay(500));
  }
}
