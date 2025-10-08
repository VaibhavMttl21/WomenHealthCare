import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import notificationService from '../../services/notificationService';
import {
  setNotifications,
  addNotifications,
  setUnreadCount,
  setLoading,
  setHasMore,
  setOffset,
  markNotificationAsRead,
  deleteNotification as deleteNotificationAction,
  markAllAsRead as markAllAsReadAction,
} from '../../store/slices/notificationSlice';
import { BellIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../ui/LoadingSpinner';

interface NotificationPanelProps {
  isMobile?: boolean;
}

const NotificationPanel = ({ isMobile = false }: NotificationPanelProps) => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, hasMore, offset } = useAppSelector(
    (state) => state.notification
  );
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id || isLoading) return;

    try {
      dispatch(setLoading(true));
      const response = await notificationService.getUserNotifications(
        user.id,
        undefined,
        20,
        offset
      );

      if (offset === 0) {
        dispatch(setNotifications(response.notifications));
      } else {
        dispatch(addNotifications(response.notifications));
      }

      dispatch(setHasMore(response.hasMore));
      dispatch(setOffset(offset + response.notifications.length));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const count = await notificationService.getUnreadCount(user.id);
      dispatch(setUnreadCount(count));
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await notificationService.markAsRead(notificationId, user.id);
      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      dispatch(markAllAsReadAction());
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      await notificationService.deleteNotification(notificationId, user.id);
      dispatch(deleteNotificationAction(notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
      case 'appointment_reminder':
        return '🏥';
      case 'doctor_message':
        return '💬';
      case 'medication_reminder':
        return '💊';
      case 'health_tip':
        return '💡';
      case 'emergency':
        return '🚨';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isMobile 
            ? 'hover:bg-white/10' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="Notifications"
      >
        <BellIcon className={`h-6 w-6 ${isMobile ? 'text-white' : 'text-neutral-charcoal'}`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${
            isMobile 
              ? 'bg-secondary-400 text-neutral-charcoal' 
              : 'bg-primary-pink text-white'
          }`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 z-20 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <CheckIcon className="h-4 w-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {isLoading && offset === 0 ? (
                <div className="flex justify-center items-center p-8">
                  <LoadingSpinner />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <button
                             title='Delete'
                              onClick={() => handleDelete(notification.id)}
                              className="ml-2 text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Load More */}
                  {hasMore && (
                    <div className="p-4 text-center">
                      <button
                        onClick={loadNotifications}
                        disabled={isLoading}
                        className="text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                      >
                        {isLoading ? 'Loading...' : 'Load more'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
