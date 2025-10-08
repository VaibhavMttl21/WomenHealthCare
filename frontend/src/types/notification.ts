export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  scheduledFor: string | null;
  metadata: string | null;
  createdAt: string;
}

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

export interface NotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface SendNotificationRequest {
  userId: string;
  title: string;
  body: string;
  type?: NotificationType;
  data?: Record<string, any>;
  actionUrl?: string;
  scheduledFor?: string;
}

export interface RegisterTokenRequest {
  userId: string;
  token: string;
  deviceType: string;
  deviceName?: string;
}

export interface FCMPayload {
  notification?: {
    title: string;
    body: string;
    image?: string;
  };
  data?: Record<string, string>;
}
