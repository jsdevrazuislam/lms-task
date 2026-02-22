export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  ENROLLMENT = 'ENROLLMENT',
  PAYMENT = 'PAYMENT',
  COURSE_UPDATE = 'COURSE_UPDATE',
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotification {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}
