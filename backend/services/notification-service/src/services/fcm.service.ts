import { messaging } from '../config/firebase.config';
import { NotificationPayload, FCMMessage } from '../types/notification.types';
import { prisma } from '../config/database.config';

class FCMService {
  /**
   * Send notification to a single device token
   */
  async sendToToken(token: string, payload: NotificationPayload): Promise<boolean> {
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized. Cannot send notification.');
      console.error('❌ Check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in .env');
      return false;
    }

    try {
      const message = this.buildFCMMessage(token, payload);
      console.log('📤 Attempting to send FCM message to token:', token.substring(0, 20) + '...');
      const response = await messaging.send(message);
      console.log('✅ Successfully sent notification. Message ID:', response);
      return true;
    } catch (error: any) {
      console.error('❌ Error sending notification to token:', token.substring(0, 20) + '...');
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      
      // Handle invalid tokens
      if (error.code === 'messaging/invalid-registration-token' || 
          error.code === 'messaging/registration-token-not-registered') {
        console.warn('⚠️ Marking token as inactive due to:', error.code);
        await this.markTokenAsInactive(token);
      }
      
      return false;
    }
  }

  /**
   * Send notification to multiple device tokens
   */
  async sendToMultipleTokens(tokens: string[], payload: NotificationPayload): Promise<{
    successCount: number;
    failureCount: number;
    failedTokens: string[];
  }> {
    if (!messaging) {
      console.error('❌ Firebase messaging not initialized. Cannot send notifications.');
      console.error('❌ Messaging object:', messaging);
      return { successCount: 0, failureCount: tokens.length, failedTokens: tokens };
    }

    if (tokens.length === 0) {
      return { successCount: 0, failureCount: 0, failedTokens: [] };
    }

    console.log('🔍 Checking token validity in database...');
    // Check if tokens are still active in database using imported prisma instance
    
    for (const token of tokens) {
      const dbToken = await prisma.deviceToken.findUnique({
        where: { token },
      });
      if (!dbToken) {
        console.warn('⚠️ Token not found in database:', token.substring(0, 20) + '...');
      } else if (!dbToken.isActive) {
        console.warn('⚠️ Token is marked as inactive in database:', token.substring(0, 20) + '...');
      } else {
        console.log('✅ Token is active in database:', token.substring(0, 20) + '...');
      }
    }

    try {
      console.log('🔍 Messaging object exists:', !!messaging);
      console.log('🔍 sendEachForMulticast method exists:', typeof messaging.sendEachForMulticast);
      
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data ? this.convertDataToStrings(payload.data) : undefined,
        tokens: tokens,
        webpush: {
          notification: {
            icon: '/vite.svg',
            badge: '/vite.svg',
            requireInteraction: payload.type === 'emergency',
          },
          fcmOptions: {
            link: payload.actionUrl || '/',
          },
        },
      };

      console.log('📤 Sending message:', JSON.stringify(message, null, 2));
      
      if (!messaging.sendEachForMulticast) {
        throw new Error('sendEachForMulticast method not available on messaging object');
      }
      
      const response = await messaging.sendEachForMulticast(message);
      console.log(`📊 FCM Send Result: ✅ ${response.successCount} succeeded, ❌ ${response.failureCount} failed`);

      // Mark failed tokens as inactive
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const token = tokens[idx];
          failedTokens.push(token!);
          
          console.error('❌ Failed to send to token:', token?.substring(0, 20) + '...');
          console.error('❌ Error code:', resp.error?.code);
          console.error('❌ Error message:', resp.error?.message);
          
          if (resp.error?.code === 'messaging/invalid-registration-token' || 
              resp.error?.code === 'messaging/registration-token-not-registered') {
            console.warn('⚠️ Marking token as inactive:', token?.substring(0, 20) + '...');
            this.markTokenAsInactive(token!);
          }
        } else {
          console.log('✅ Successfully sent to token:', tokens[idx]?.substring(0, 20) + '...');
        }
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        failedTokens,
      };
    } catch (error) {
      console.error('❌ Error sending multicast notification:', error);
      return { successCount: 0, failureCount: tokens.length, failedTokens: tokens };
    }
  }

  /**
   * Send notification to a topic
   */
  async sendToTopic(topic: string, payload: NotificationPayload): Promise<boolean> {
    if (!messaging) {
      console.warn('Firebase messaging not initialized. Cannot send notification.');
      return false;
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data ? this.convertDataToStrings(payload.data) : undefined,
        topic: topic,
        webpush: {
          notification: {
            icon: '/notification-icon.png',
            requireInteraction: payload.type === 'emergency',
          },
        },
      };

      const response = await messaging.send(message);
      console.log('✅ Successfully sent notification to topic:', response);
      return true;
    } catch (error) {
      console.error('❌ Error sending notification to topic:', error);
      return false;
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    if (!messaging) {
      console.warn('Firebase messaging not initialized.');
      return;
    }

    try {
      const response = await messaging.subscribeToTopic(tokens, topic);
      console.log(`✅ Successfully subscribed ${response.successCount} tokens to topic: ${topic}`);
    } catch (error) {
      console.error('❌ Error subscribing to topic:', error);
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    if (!messaging) {
      console.warn('Firebase messaging not initialized.');
      return;
    }

    try {
      const response = await messaging.unsubscribeFromTopic(tokens, topic);
      console.log(`✅ Successfully unsubscribed ${response.successCount} tokens from topic: ${topic}`);
    } catch (error) {
      console.error('❌ Error unsubscribing from topic:', error);
    }
  }

  /**
   * Build FCM message object
   */
  private buildFCMMessage(token: string, payload: NotificationPayload): FCMMessage {
    return {
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data ? this.convertDataToStrings(payload.data) : undefined,
      token: token,
      webpush: {
        notification: {
          icon: '/notification-icon.png',
          badge: '/badge-icon.png',
          image: payload.imageUrl,
          requireInteraction: payload.type === 'emergency',
          tag: payload.type,
        },
        fcmOptions: {
          link: payload.actionUrl || '/',
        },
      },
      android: {
        priority: payload.type === 'emergency' ? 'high' : 'normal',
        notification: {
          channelId: 'default',
          sound: 'default',
          clickAction: payload.actionUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
            category: payload.type,
          },
        },
      },
    };
  }

  /**
   * Convert data object to strings (FCM requirement)
   */
  private convertDataToStrings(data: Record<string, any>): Record<string, string> {
    const stringData: Record<string, string> = {};
    for (const key in data) {
      stringData[key] = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
    }
    return stringData;
  }

  /**
   * Mark token as inactive in database
   */
  private async markTokenAsInactive(token: string): Promise<void> {
    try {
      await prisma.deviceToken.update({
        where: { token },
        data: { isActive: false },
      });
      console.log(`🔒 Marked token as inactive: ${token.substring(0, 20)}...`);
    } catch (error) {
      console.error('❌ Error marking token as inactive:', error);
    }
  }
}

export default new FCMService();
