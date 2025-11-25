import { Community } from '@/cards/_cards/community-join-card/community-join-card';

export const NYC_CODERS: Community = {
  name: 'Angular Coders',
  description:
    'We are a community of developers prepping for coding interviews, particip...',
  memberCount: 4000,
  logo: {
    letter: 'A',
    gradient: 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500',
  },
  members: [
    { id: 'user1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/80?img=1' },
    { id: 'user2', name: 'Maria Garcia', avatarUrl: 'https://i.pravatar.cc/80?img=2' },
    { id: 'user3', name: 'David Smith', avatarUrl: 'https://i.pravatar.cc/80?img=3' },
  ],
};
