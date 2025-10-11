import { Router } from 'express';
import {
  sendNotification,
  sendBulkNotification,
  registerToken,
  unregisterToken,
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

// Development test endpoint
if (process.env.NODE_ENV === 'development') {
  router.post('/test', async (req, res) => {
    try {
      const { userId, title = 'Test Notification', body = 'This is a test notification from the backend' } = req.body;
      
      if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
      }

      const result = await notificationService.sendToUser({
        userId,
        notification: {
          title,
          body,
          type: 'general' as any,
          data: { test: true, timestamp: new Date().toISOString() },
        },
        saveToDatabase: true,
      });

      res.status(200).json({
        success: true,
        message: 'Test notification sent',
        result,
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      res.status(500).json({ success: false, message: 'Failed to send test notification' });
    }
  });
}

export default router;
