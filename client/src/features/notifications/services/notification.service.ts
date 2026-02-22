import apiClient from "@/lib/apiClient";
import {
  INotification,
  INotificationResponse,
} from "../types/notification.types";

export const notificationService = {
  /**
   * Fetch recent notifications for the current user
   */
  async getNotifications(): Promise<INotification[]> {
    const response =
      await apiClient.get<INotificationResponse>("/notifications");
    return response.data.data;
  },

  /**
   * Mark a specific notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read for the current user
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
