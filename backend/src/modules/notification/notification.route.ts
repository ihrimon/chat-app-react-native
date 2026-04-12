import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from './notification.controller';

const router = Router();

router.get('/', authenticate, authorize('user', 'admin'), getNotifications);
router.get(
  '/unread-count',
  authenticate,
  authorize('user', 'admin'),
  getUnreadCount,
);
router.patch(
  '/:notificationId/read',
  authenticate,
  authorize('user', 'admin'),
  markAsRead,
);
router.patch(
  '/read-all',
  authenticate,
  authorize('user', 'admin'),
  markAllAsRead,
);

export const notificationRoutes = router;
