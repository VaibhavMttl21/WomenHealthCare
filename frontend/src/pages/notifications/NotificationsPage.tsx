import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  resetNotifications,
} from '../../store/slices/notificationSlice';
import {
  BellIcon,
  TrashIcon,
  CheckIcon,
  FunnelIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { NotificationType } from '../../types/notification';

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading, hasMore, offset } = useAppSelector(
    (state) => state.notification
  );
  const { user } = useAppSelector((state) => state.auth);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  useEffect(() => {
    if (user?.id) {
      loadNotifications(true);
      loadUnreadCount();
    }

    return () => {
      dispatch(resetNotifications());
    };
  }, [user?.id, filterType, filterRead]);

  const loadNotifications = async (reset = false) => {
    if (!user?.id || isLoading) return;

    try {
      dispatch(setLoading(true));

      const filter: any = {};
      if (filterType !== 'all') filter.type = filterType;
      if (filterRead === 'read') filter.isRead = true;
      if (filterRead === 'unread') filter.isRead = false;

      const currentOffset = reset ? 0 : offset;
      const response = await notificationService.getUserNotifications(
        user.id,
        filter,
        20,
        currentOffset
      );

      if (reset) {
        dispatch(setNotifications(response.notifications));
        dispatch(setOffset(response.notifications.length));
      } else {
        dispatch(addNotifications(response.notifications));
        dispatch(setOffset(currentOffset + response.notifications.length));
      }

      dispatch(setHasMore(response.hasMore));
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
      case 'appointment_cancelled':
        return '❌';
      case 'appointment_rescheduled':
        return '🔄';
      case 'doctor_message':
        return '💬';
      case 'medication_reminder':
        return '💊';
      case 'checkup_reminder':
        return '📋';
      case 'health_tip':
        return '💡';
      case 'emergency':
        return '🚨';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BellIcon className="h-8 w-8" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'doctor' && (
              <Link
                to="/notifications/send"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-maroon text-white rounded-lg hover:bg-primary-maroon/90 transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                Send Notification
              </Link>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <CheckIcon className="h-5 w-5" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FunnelIcon className="h-4 w-4 inline mr-1" />
              Filter by type
            </label>
            <select
              title='Filter by type'
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as NotificationType | 'all');
                dispatch(resetNotifications());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value={NotificationType.APPOINTMENT}>Appointments</option>
              <option value={NotificationType.APPOINTMENT_REMINDER}>Appointment Reminders</option>
              <option value={NotificationType.DOCTOR_MESSAGE}>Doctor Messages</option>
              <option value={NotificationType.MEDICATION_REMINDER}>Medication Reminders</option>
              <option value={NotificationType.HEALTH_TIP}>Health Tips</option>
              <option value={NotificationType.EMERGENCY}>Emergency</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by status
            </label>
            <select
              title='Filter by status'
              value={filterRead}
              onChange={(e) => {
                setFilterRead(e.target.value as 'all' | 'read' | 'unread');
                dispatch(resetNotifications());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading && offset === 0 ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-12">
            <BellIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filterType !== 'all' || filterRead !== 'all'
                ? 'No notifications match your filters'
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="p-6 text-center border-t border-gray-200">
                <button
                  onClick={() => loadNotifications(false)}
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
