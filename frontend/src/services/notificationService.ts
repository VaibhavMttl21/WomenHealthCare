import axios from 'axios';
import { messaging, getToken, onMessage, VAPID_KEY } from '../config/firebase.config';
import toast from 'react-hot-toast';
import type {
  NotificationFilter,
  NotificationResponse,
  RegisterTokenRequest,
  SendNotificationRequest,
  FCMPayload,
} from '../types/notification';

// Use API Gateway URL instead of direct service URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Notification API: Unauthorized. User may need to re-login.');
      // Don't redirect here, let the main auth service handle it
    }
    return Promise.reject(error);
  }
);

// Validate VAPID key
if (!VAPID_KEY || VAPID_KEY === 'vapid-key') {
  console.error('❌ VAPID key not configured. Push notifications will not work.');
  console.error('❌ Please set VITE_FIREBASE_VAPID_KEY in your .env file');
}

class NotificationService {
  private currentToken: string | null = null;

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token from Firebase with retry logic
   */
  async getFCMToken(retryCount = 0): Promise<string | null> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    if (!messaging) {
      console.warn('❌ Firebase messaging not available');
      return null;
    }

    if (!VAPID_KEY || VAPID_KEY === 'vapid-key') {
      console.error('❌ VAPID key not configured. Cannot get FCM token.');
      return null;
    }

    try {
      // Request permission first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('⚠️ Notification permission denied');
        return null;
      }

      // Get existing service worker registration
      let registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      
      // If not found, try to register it
      if (!registration) {
        console.log('🔄 Registering Firebase service worker...');
        try {
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('✅ Service Worker registered:', registration);
        } catch (swError) {
          console.error('❌ Failed to register service worker:', swError);
          throw new Error('Service worker registration failed');
        }
      } else {
        console.log('✅ Service Worker already registered:', registration);
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        this.currentToken = token;
        console.log('✅ FCM Token obtained:', token.substring(0, 20) + '...');
        return token;
      } else {
        throw new Error('No FCM token returned from Firebase');
      }
    } catch (error) {
      console.error(`❌ Error getting FCM token (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
      
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.getFCMToken(retryCount + 1);
      } else {
        console.error('❌ Max retries reached. FCM token generation failed.');
        return null;
      }
    }
  }

  /**
   * Register device token with backend
   */
  async registerDeviceToken(userId: string): Promise<boolean> {
    try {
      const token = await this.getFCMToken();
      if (!token) {
        return false;
      }

      const deviceName = this.getDeviceName();
      const request: RegisterTokenRequest = {
        userId,
        token,
        deviceType: 'web',
        deviceName,
      };

      const response = await api.post(`/notifications/tokens/register`, request);
      console.log('✅ Device token registered successfully:', {
        userId,
        tokenPreview: token.substring(0, 20) + '...',
        deviceType: 'web',
        deviceName
      });
      return response.data.success;
    } catch (error) {
      console.error('Error registering device token:', error);
      return false;
    }
  }

  /**
   * Unregister device token
   */
  async unregisterDeviceToken(): Promise<boolean> {
    if (!this.currentToken) {
      return false;
    }

    try {
      const response = await api.post(`/notifications/tokens/unregister`, {
        token: this.currentToken,
      });
      return response.data.success;
    } catch (error) {
      console.error('Error unregistering device token:', error);
      return false;
    }
  }

  /**
   * Listen for foreground messages
   */
  setupMessageListener(callback?: (payload: FCMPayload) => void): void {
    if (!messaging) {
      console.warn('❌ Firebase messaging not initialized');
      return;
    }

    console.log('🎧 [notificationService] Setting up onMessage listener...');
    
    onMessage(messaging, (payload) => {
      console.log('📨 [FOREGROUND] Message received:', payload);
      console.log('📨 [FOREGROUND] Title:', payload.notification?.title);
      console.log('📨 [FOREGROUND] Body:', payload.notification?.body);
      console.log('📨 [FOREGROUND] Data:', payload.data);

      // Show toast notification
      const notification = payload.notification;
      if (notification) {
        toast(
          `${notification.title}\n${notification.body}`,
          {
            icon: '🔔',
            duration: 5000,
          }
        );
      }

      // Call custom callback if provided
      if (callback) {
        console.log('📨 [FOREGROUND] Calling callback with payload');
        callback(payload as FCMPayload);
      } else {
        console.log('📨 [FOREGROUND] No callback provided');
      }
    });
    
    console.log('✅ [notificationService] onMessage listener set up successfully');
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    filter?: NotificationFilter,
    limit = 20,
    offset = 0
  ): Promise<NotificationResponse> {
    try {
      const params = new URLSearchParams();
      if (filter?.type) params.append('type', filter.type);
      if (filter?.isRead !== undefined) params.append('isRead', String(filter.isRead));
      if (filter?.startDate) params.append('startDate', filter.startDate.toISOString());
      if (filter?.endDate) params.append('endDate', filter.endDate.toISOString());
      params.append('limit', String(limit));
      params.append('offset', String(offset));

      const response = await api.get(`/notifications/user/${userId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`, { userId });
      return response.data.success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const response = await api.patch(`/notifications/read-all`, { userId });
      return response.data.success;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const response = await api.delete(`/notifications/${notificationId}`, {
        data: { userId },
      });
      return response.data.success;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Send notification (admin/doctor use)
   */
  async sendNotification(request: SendNotificationRequest): Promise<boolean> {
    try {
      const response = await api.post(`/notifications/send`, request);
      return response.data.success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  /**
   * Get device name
   */
  private getDeviceName(): string {
    const ua = navigator.userAgent;
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';

    // Detect browser
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';

    // Detect OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return `${browser} on ${os}`;
  }
}

export default new NotificationService();
