import { Router } from 'express';
import {
  sendNotification,
  sendBulkNotification,
  registerToken,
  unregisterToken,
  unregisterUserTokens,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  sendAppointmentReminder,
  sendDoctorMessage,
} from '../controllers/notification.controller';

const router = Router();

// Token management
router.post('/tokens/register', registerToken);
router.post('/tokens/unregister', unregisterToken);
router.post('/tokens/unregister-user', unregisterUserTokens);

// Send notifications
router.post('/send', sendNotification);
router.post('/send/bulk', sendBulkNotification);

// Specialized notifications
router.post('/send/appointment-reminder', sendAppointmentReminder);
router.post('/send/doctor-message', sendDoctorMessage);

// Get notifications
router.get('/user/:userId', getUserNotifications);
router.get('/user/:userId/unread-count', getUnreadCount);

// Update notifications
router.patch('/:notificationId/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:notificationId', deleteNotification);

export default router;
