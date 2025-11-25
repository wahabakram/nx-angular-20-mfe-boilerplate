import { INotification } from '@ng-mf/components';

export const ACCOUNT_NOTIFICATIONS: INotification[] = [
  {
    actor: {
      id: 1,
      name: 'Justin Hansen',
      username: 'justin.hansen',
      avatarUrl: 'assets/avatars/6.svg',
    },
    notifier: {
      id: 2,
      name: 'Elma Johnson',
      username: 'elma.johnson',
      avatarUrl: 'assets/avatars/4.svg',
    },
    payload: {
      content: 'what did you say?',
    },
    isNew: true,
    type: 'mentionedInComment',
    createdAt: '1 hour ago',
  },
  {
    actor: {
      id: 3,
      name: 'Johnny Gladden',
      username: 'johnny.gladden',
      avatarUrl: 'assets/avatars/3.svg',
    },
    notifier: {
      id: 4,
      name: 'Angela Naylor',
      username: 'angela.naylor',
      avatarUrl: 'assets/avatars/1.svg',
    },
    payload: {
      folderName: 'My New Project',
    },
    isNew: true,
    type: 'inviteToEditFilesInFolder',
    createdAt: '2 hours ago',
  },
  {
    actor: {
      id: 1,
      name: 'Justin Hansen',
      username: 'justin.hansen',
      avatarUrl: 'assets/avatars/7.svg',
    },
    notifier: {
      id: 2,
      name: 'Elma Johnson',
      username: 'elma.johnson',
      avatarUrl: 'assets/avatars/8.svg',
    },
    payload: {
      content: 'what did you say?',
    },
    type: 'mentionedInComment',
    createdAt: '1 hour ago',
  },
];
