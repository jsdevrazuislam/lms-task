export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  ENROLLMENT = "ENROLLMENT",
  SYSTEM = "SYSTEM",
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationResponse {
  success: boolean;
  message: string;
  data: INotification[];
}
