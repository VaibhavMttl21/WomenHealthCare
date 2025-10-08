export enum NotificationType {
  APPOINTMENT = 'appointment',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  DOCTOR_MESSAGE = 'doctor_message',
  MEDICATION_REMINDER = 'medication_reminder',
  CHECKUP_REMINDER = 'checkup_reminder',
  HEALTH_TIP = 'health_tip',
  GENERAL = 'general',
  EMERGENCY = 'emergency',
}

export enum DeviceType {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
}

export interface NotificationPayload {
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
}

export interface SendNotificationRequest {
  userId: string;
  notification: NotificationPayload;
  scheduledFor?: Date;
  saveToDatabase?: boolean;
}

export interface BulkNotificationRequest {
  userIds: string[];
  notification: NotificationPayload;
  scheduledFor?: Date;
}

export interface RegisterTokenRequest {
  userId: string;
  token: string;
  deviceType: DeviceType;
  deviceName?: string;
}

export interface NotificationFilter {
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
  isSent?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface FCMMessage {
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  };
  data?: { [key: string]: string };
  token: string;
  webpush?: {
    notification: {
      icon?: string;
      badge?: string;
      image?: string;
      requireInteraction?: boolean;
      tag?: string;
    };
    fcmOptions?: {
      link?: string;
    };
  };
  android?: {
    priority: 'high' | 'normal';
    notification: {
      channelId?: string;
      sound?: string;
      clickAction?: string;
    };
  };
  apns?: {
    payload: {
      aps: {
        sound?: string;
        badge?: number;
        category?: string;
      };
    };
  };
}
