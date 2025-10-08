import { prisma } from '../config/database.config';
import fcmService from './fcm.service';
import {
  NotificationPayload,
  SendNotificationRequest,
  BulkNotificationRequest,
  NotificationFilter,
  NotificationType,
} from '../types/notification.types';

class NotificationService {
  /**
   * Send notification to a user
   */
  async sendToUser(request: SendNotificationRequest): Promise<{
    success: boolean;
    notificationId?: string;
    message?: string;
  }> {
    try {
      const { userId, notification, scheduledFor, saveToDatabase = true } = request;

      // Save to database if requested
      let notificationId: string | undefined;
      if (saveToDatabase) {
        const dbNotification = await prisma.notification.create({
          data: {
            userId,
            title: notification.title,
            message: notification.body,
            type: notification.type,
            metadata: notification.data ? JSON.stringify(notification.data) : null,
            scheduledFor: scheduledFor || null,
            isSent: !scheduledFor, // Mark as sent immediately if not scheduled
            sentAt: !scheduledFor ? new Date() : null,
          },
        });
        notificationId = dbNotification.id;
      }

      // If scheduled, don't send now
      if (scheduledFor) {
        return {
          success: true,
          notificationId,
          message: 'Notification scheduled successfully',
        };
      }

      // Get user's active device tokens
      const deviceTokens = await prisma.deviceToken.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      if (deviceTokens.length === 0) {
        console.warn(`No active device tokens found for user: ${userId}`);
        return {
          success: true,
          notificationId,
          message: 'No active devices to send notification',
        };
      }

      // Send to all user's devices
      const tokens = deviceTokens.map((dt) => dt.token);
      const result = await fcmService.sendToMultipleTokens(tokens, notification);

      // Update last used time for successful tokens
      const successfulTokens = tokens.filter(
        (token) => !result.failedTokens.includes(token)
      );
      
      if (successfulTokens.length > 0) {
        await prisma.deviceToken.updateMany({
          where: {
            token: { in: successfulTokens },
          },
          data: {
            lastUsedAt: new Date(),
          },
        });
      }

      return {
        success: result.successCount > 0,
        notificationId,
        message: `Sent to ${result.successCount} devices, ${result.failureCount} failed`,
      };
    } catch (error) {
      console.error('❌ Error sending notification to user:', error);
      return {
        success: false,
        message: 'Failed to send notification',
      };
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToMultipleUsers(request: BulkNotificationRequest): Promise<{
    success: boolean;
    sentCount: number;
    failedCount: number;
  }> {
    const results = await Promise.all(
      request.userIds.map((userId) =>
        this.sendToUser({
          userId,
          notification: request.notification,
          scheduledFor: request.scheduledFor,
          saveToDatabase: true,
        })
      )
    );

    const sentCount = results.filter((r) => r.success).length;
    const failedCount = results.length - sentCount;

    return {
      success: sentCount > 0,
      sentCount,
      failedCount,
    };
  }

  /**
   * Register device token
   */
  async registerDeviceToken(
    userId: string,
    token: string,
    deviceType: string,
    deviceName?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if token already exists
      const existingToken = await prisma.deviceToken.findUnique({
        where: { token },
      });

      if (existingToken) {
        // Update existing token
        await prisma.deviceToken.update({
          where: { token },
          data: {
            userId,
            isActive: true,
            lastUsedAt: new Date(),
            deviceName: deviceName || existingToken.deviceName,
          },
        });
        return {
          success: true,
          message: 'Device token updated successfully',
        };
      }

      // Create new token
      await prisma.deviceToken.create({
        data: {
          userId,
          token,
          deviceType,
          deviceName: deviceName || 'Unknown Device',
          isActive: true,
          lastUsedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Device token registered successfully',
      };
    } catch (error) {
      console.error('❌ Error registering device token:', error);
      return {
        success: false,
        message: 'Failed to register device token',
      };
    }
  }

  /**
   * Unregister device token
   */
  async unregisterDeviceToken(token: string): Promise<boolean> {
    try {
      await prisma.deviceToken.update({
        where: { token },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      console.error('❌ Error unregistering device token:', error);
      return false;
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    filter?: NotificationFilter,
    limit = 50,
    offset = 0
  ) {
    try {
      const where: any = { userId };

      if (filter?.type) {
        where.type = filter.type;
      }

      if (filter?.isRead !== undefined) {
        where.isRead = filter.isRead;
      }

      if (filter?.startDate || filter?.endDate) {
        where.createdAt = {};
        if (filter.startDate) {
          where.createdAt.gte = filter.startDate;
        }
        if (filter.endDate) {
          where.createdAt.lte = filter.endDate;
        }
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.notification.count({ where }),
      ]);

      return {
        notifications,
        total,
        limit,
        offset,
        hasMore: total > offset + limit,
      };
    } catch (error) {
      console.error('❌ Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId,
        },
        data: {
          isRead: true,
        },
      });
      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
      return true;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          userId,
        },
      });
      return true;
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });
      return count;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Send scheduled notifications
   */
  async sendScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      
      // Get all notifications scheduled for now or earlier that haven't been sent
      const scheduledNotifications = await prisma.notification.findMany({
        where: {
          isSent: false,
          scheduledFor: {
            lte: now,
          },
        },
      });

      console.log(`📅 Found ${scheduledNotifications.length} scheduled notifications to send`);

      for (const notification of scheduledNotifications) {
        await this.sendToUser({
          userId: notification.userId,
          notification: {
            title: notification.title,
            body: notification.message,
            type: notification.type as NotificationType,
            data: notification.metadata ? JSON.parse(notification.metadata) : undefined,
          },
          saveToDatabase: false, // Already saved
        });

        // Mark as sent
        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            isSent: true,
            sentAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('❌ Error sending scheduled notifications:', error);
    }
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(appointmentId: string): Promise<boolean> {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!appointment) {
        console.error('Appointment not found:', appointmentId);
        return false;
      }

      const appointmentDate = new Date(appointment.appointmentDate);
      const formattedDate = appointmentDate.toLocaleDateString();
      const formattedTime = appointment.appointmentTime;

      await this.sendToUser({
        userId: appointment.patientId,
        notification: {
          title: '🏥 Appointment Reminder',
          body: `You have an appointment with Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName} on ${formattedDate} at ${formattedTime}`,
          type: NotificationType.APPOINTMENT_REMINDER,
          data: {
            appointmentId: appointment.id,
            doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
            date: formattedDate,
            time: formattedTime,
          },
          actionUrl: `/appointments/${appointment.id}`,
        },
        saveToDatabase: true,
      });

      return true;
    } catch (error) {
      console.error('❌ Error sending appointment reminder:', error);
      return false;
    }
  }

  /**
   * Send doctor message notification
   */
  async sendDoctorMessageNotification(
    patientId: string,
    doctorName: string,
    messagePreview: string
  ): Promise<boolean> {
    try {
      await this.sendToUser({
        userId: patientId,
        notification: {
          title: `💬 Message from Dr. ${doctorName}`,
          body: messagePreview,
          type: NotificationType.DOCTOR_MESSAGE,
          data: {
            doctorName,
          },
          actionUrl: '/chat',
        },
        saveToDatabase: true,
      });

      return true;
    } catch (error) {
      console.error('❌ Error sending doctor message notification:', error);
      return false;
    }
  }
}

export default new NotificationService();
