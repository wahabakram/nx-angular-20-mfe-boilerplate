export interface INotification {
  actor: any,
  type: string;
  createdAt: string;
  isUnread?: boolean;
  [propName: string]: any;
}
