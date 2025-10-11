import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import notificationService from '../services/notificationService';
import { addNotification } from '../store/slices/notificationSlice';
import { NotificationType } from '@/types/notification';

/**
 * Custom hook to initialize and manage push notifications
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) return;

    const initializeNotifications = async () => {
      try {
        // Check if notification permission is already granted
        if (!('Notification' in window)) {
          console.warn('⚠️ This browser does not support notifications');
          return;
        }

        if (!('serviceWorker' in navigator)) {
          console.warn('⚠️ This browser does not support service workers');
          return;
        }

        console.log('🔧 Initializing notifications for user:', user.id);

        // Only request permission if not already granted
        const permission = Notification.permission;
        
        if (permission === 'granted') {
          // Permission already granted, register device token
          console.log('✅ Notification permission already granted');
          const success = await notificationService.registerDeviceToken(user.id);
          if (!success) {
            console.warn('⚠️ Failed to register device token despite having permission');
          }
        } else if (permission === 'default') {
          // Permission not asked yet, request it
          console.log('📱 Requesting notification permission...');
          const granted = await notificationService.requestPermission();
          if (granted) {
            const success = await notificationService.registerDeviceToken(user.id);
            if (!success) {
              console.warn('⚠️ Failed to register device token after permission granted');
            }
          } else {
            console.warn('⚠️ Notification permission denied by user');
          }
        } else {
          // Permission denied
          console.warn('⚠️ Notification permission was previously denied');
          console.warn('💡 User can enable notifications in browser settings');
        }

        // Setup message listener (always setup regardless of permission)
        console.log('🎧 Setting up foreground message listener...');
        notificationService.setupMessageListener((payload) => {
          console.log('🔔 [useNotifications] Received notification payload:', payload);
              
          // Add notification to Redux store when received in foreground
          if (payload.notification) {
            const notification = {
              id: Date.now().toString(), // Temporary ID
              userId: user.id,
              title: payload.notification.title,
              message: payload.notification.body,
              type: payload.data?.type as NotificationType,
              isRead: false,
              scheduledFor: null,
              metadata: payload.data ? JSON.stringify(payload.data) : null,
              createdAt: new Date().toISOString(),
            };
            console.log('💾 Adding notification to Redux store:', notification);
            console.log('💾 Adding notification to Redux store:', notification);
            dispatch(addNotification(notification));
          }
        });

        console.log('✅ Notifications initialized successfully for user:', user.id);
      } catch (error) {
        console.error('❌ Error initializing notifications:', error);
        if (error instanceof Error) {
          console.error('❌ Error details:', error.message);
        }
        // Show user-friendly error in development
        if (import.meta.env.DEV) {
          console.error('💡 Check browser console for detailed error information');
        }
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      // Optionally unregister token when component unmounts
      // Note: Don't unregister on every unmount, only on logout
    };
  }, [user?.id, dispatch]);

  return {
    requestPermission: notificationService.requestPermission.bind(notificationService),
    registerDevice: () => user?.id && notificationService.registerDeviceToken(user.id),
  };
};
