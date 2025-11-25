export type AnnouncementVariant = 'neutral' | 'negative' | 'warning' | 'positive' | 'informative' | string;
export interface AnnouncementInterface {
  iconName?: string;
  variant: AnnouncementVariant;
  message: string;
}
