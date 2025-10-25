import { Request, Response } from 'express';
import notificationService from '../services/notification.service';
import { NotificationType, DeviceType } from '../types/notification.types';

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, body, type, data, actionUrl, scheduledFor } = req.body;

    const result = await notificationService.sendToUser({
      userId,
      notification: {
        title,
        body,
        type: type || NotificationType.GENERAL,
        data,
        actionUrl,
      },
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      saveToDatabase: true,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const sendBulkNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userIds, title, body, type, data, actionUrl, scheduledFor } = req.body;

    const result = await notificationService.sendToMultipleUsers({
      userIds,
      notification: {
        title,
        body,
        type: type || NotificationType.GENERAL,
        data,
        actionUrl,
      },
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending bulk notification:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const registerToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, token, deviceType, deviceName } = req.body;

    const result = await notificationService.registerDeviceToken(
      userId,
      token,
      deviceType || DeviceType.WEB,
      deviceName
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error registering token:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const unregisterToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    const result = await notificationService.unregisterDeviceToken(token);

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error unregistering token:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const unregisterUserTokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    console.log('🔄 [Controller] Unregister user tokens request received');
    console.log('🔄 [Controller] User ID:', userId);

    if (!userId) {
      console.warn('⚠️ [Controller] Missing userId in request');
      res.status(400).json({ success: false, message: 'userId is required' });
      return;
    }

    console.log('🔄 [Controller] Calling service to unregister tokens...');
    const result = await notificationService.unregisterUserDeviceTokens(userId);

    console.log('✅ [Controller] Unregister result:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ [Controller] Error unregistering user tokens:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type, isRead, startDate, endDate, limit, offset } = req.query;

    const filter: any = {};
    if (type) filter.type = type as NotificationType;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (startDate) filter.startDate = new Date(startDate as string);
    if (endDate) filter.endDate = new Date(endDate as string);

    const result = await notificationService.getUserNotifications(
      userId,
      filter,
      limit ? parseInt(limit as string) : 50,
      offset ? parseInt(offset as string) : 0
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const result = await notificationService.markAsRead(notificationId, userId);

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const result = await notificationService.deleteNotification(notificationId, userId);

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const count = await notificationService.getUnreadCount(userId);

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendAppointmentReminder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.body;

    const result = await notificationService.sendAppointmentReminder(appointmentId);

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error sending appointment reminder:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const sendDoctorMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, doctorName, messagePreview } = req.body;

    const result = await notificationService.sendDoctorMessageNotification(
      patientId,
      doctorName,
      messagePreview
    );

    res.status(200).json({ success: result });
  } catch (error) {
    console.error('Error sending doctor message notification:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
