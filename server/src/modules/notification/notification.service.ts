import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import prisma from '../../config/prisma.js';
import { emitToUser, SocketEvent } from '../../config/socket.js';

import type { ICreateNotification } from './notification.interface.js';

/**
 * Create a new notification for a user
 */
const createNotification = async (data: ICreateNotification) => {
  const notification = await prisma.notification.create({
    data,
  });

  // Emit real-time notification
  emitToUser(data.userId, SocketEvent.NOTIFICATION, notification);

  return notification;
};

/**
 * Get all notifications for a specific user
 */
const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50, // Limit to recent 50
  });
};

/**
 * Mark a notification as read
 */
const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

/**
 * Delete a notification
 */
const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  return prisma.notification.delete({
    where: { id: notificationId },
  });
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
