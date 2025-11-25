export interface SocialMediaItem {
  label: string;
  logoIcon: string;
  placeholder: string;
  formControlName: string;
}

export const SOCIAL_MEDIA_LIST: SocialMediaItem[] = [
  {
    label: 'Facebook',
    logoIcon: 'logos:facebook',
    placeholder: 'Enter link to your facebook profile',
    formControlName: 'facebookLink'
  },
  {
    label: 'X',
    logoIcon: 'logos:twitter',
    placeholder: 'Enter link to your X profile',
    formControlName: 'xLink'
  },
  {
    label: 'Discord',
    logoIcon: 'logos:discord-icon',
    placeholder: 'Enter link to your discord profile',
    formControlName: 'discordLink'
  },
  {
    label: 'Github',
    logoIcon: 'logos:github-icon',
    placeholder: 'Enter link to your github profile',
    formControlName: 'githubLink'
  }
];
