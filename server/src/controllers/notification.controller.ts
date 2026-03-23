import { Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler, apiResponse } from '../lib/utils';
import { AuthenticatedRequest } from '../types';

export class NotificationController {
  getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const notifications = await notificationService.getByUserId(req.user!.userId);
    res.status(200).json(apiResponse(notifications));
  });

  getUnreadCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    res.status(200).json(apiResponse({ count }));
  });

  markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await notificationService.markAsRead(req.params.id as string, req.user!.userId);
    res.status(200).json(apiResponse(null, 'Notification marked as read'));
  });

  markAllAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    await notificationService.markAllAsRead(req.user!.userId);
    res.status(200).json(apiResponse(null, 'All notifications marked as read'));
  });
}

export const notificationController = new NotificationController();
