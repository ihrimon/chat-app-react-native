import { AuthRequest } from '../../types';
import { ApiResponse } from '../../utils/api-response.utils';
import catchAsync from '../../utils/catch-async.utils';
import * as notificationService from './notification.service';

/* ======== Get Notifications ======== */
export const getNotifications = catchAsync<AuthRequest>(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(
    req.user!.id,
  );
  ApiResponse.success(
    res,
    'Notifications retrieved successfully',
    notifications,
  );
});

/* ======== Get Unread Count ======== */
export const getUnreadCount = catchAsync<AuthRequest>(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user!.id);
  ApiResponse.success(res, 'Unread count retrieved', { count });
});

/* ======== Mark as Read ======== */
export const markAsRead = catchAsync(async (req, res) => {
  await notificationService.markAsRead(req.params.notificationId);
  ApiResponse.success(res, 'Notification marked as read');
});

/* ======== Mark All as Read ======== */
export const markAllAsRead = catchAsync<AuthRequest>(async (req, res) => {
  await notificationService.markAllAsRead(req.user!.id);
  ApiResponse.success(res, 'All notifications marked as read');
});
