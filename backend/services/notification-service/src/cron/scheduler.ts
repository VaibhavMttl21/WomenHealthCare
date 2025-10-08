import cron from 'node-cron';
import notificationService from '../services/notification.service';

/**
 * Initialize cron jobs for scheduled notifications
 */
export const initializeCronJobs = () => {
  // Check for scheduled notifications every minute
  cron.schedule('* * * * *', async () => {
    try {
      await notificationService.sendScheduledNotifications();
    } catch (error) {
      console.error('Error in scheduled notifications cron job:', error);
    }
  });

  console.log('📅 Cron jobs initialized');
};
