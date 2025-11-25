// Mock data and types for Talent Profile page
export interface Person {
  avatarUrl: string;
  name: string;
  occupation: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Skill {
  name: string;
  level: string;
}

export const TALENT_PEOPLE_ALSO_VIEWED: Person[] = [
  {
    avatarUrl: 'assets/avatars/5.svg',
    name: 'Beaulah Hansmann',
    occupation: 'CEO of amazing company',
  },
  {
    avatarUrl: 'assets/avatars/6.svg',
    name: 'Laree Alaman',
    occupation: 'CEO of amazing company',
  },
  {
    avatarUrl: 'assets/avatars/7.svg',
    name: 'Tom Hearron',
    occupation: 'Software engineer',
  },
];

export const TALENT_LANGUAGES: Language[] = [
  { name: 'English', level: 'Native' },
  { name: 'German', level: 'Fluent' },
  { name: 'Spanish', level: 'Basic' },
];

export const TALENT_SKILLS: Skill[] = [
  { name: 'Typescript', level: 'Good' },
  { name: 'Angular', level: 'Medium' },
  { name: 'Rest API', level: 'Good' },
  { name: 'NestJS', level: 'Medium' },
];
