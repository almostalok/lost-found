import prisma from '../lib/prisma';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  /**
   * Create a notification for a user.
   */
  async create(userId: string, type: NotificationType, title: string, message: string, data?: any) {
    return prisma.notification.create({
      data: { userId, type, title, message, data },
    });
  }

  /**
   * Get all notifications for a user.
   */
  async getByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  /**
   * Get unread count.
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }
}

export const notificationService = new NotificationService();
