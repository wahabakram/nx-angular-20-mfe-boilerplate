// Use strict interfaces to avoid 'any'
export interface Follower {
  id: number;
  name: string;
  location: string;
  avatar: string;
  isFollowed: boolean;
}

export interface User {
  name: string;
  title: string;
  avatar: string;
  banner: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  followersList: Follower[];
}
