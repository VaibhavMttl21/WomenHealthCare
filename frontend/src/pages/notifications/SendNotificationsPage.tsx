import { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import notificationService from '../../services/notificationService';
import { NotificationType } from '../../types/notification';
import toast from 'react-hot-toast';
import {
  BellIcon,
  UserIcon,
  UsersIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Card } from '../../components/ui/Card';

interface SendNotificationForm {
  recipientType: 'single' | 'multiple' | 'all';
  userId: string;
  userIds: string[];
  title: string;
  body: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  scheduledFor?: string;
  actionUrl?: string;
}

const SendNotificationsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const [form, setForm] = useState<SendNotificationForm>({
    recipientType: 'single',
    userId: '',
    userIds: [],
    title: '',
    body: '',
    type: 'doctor_message',
    priority: 'medium',
    scheduledFor: '',
    actionUrl: '',
  });

  const notificationTypes = [
    { value: 'appointment', label: 'Appointment', icon: '🏥' },
    { value: 'appointment_reminder', label: 'Appointment Reminder', icon: '⏰' },
    { value: 'doctor_message', label: 'Doctor Message', icon: '💬' },
    { value: 'medication_reminder', label: 'Medication Reminder', icon: '💊' },
    { value: 'health_tip', label: 'Health Tip', icon: '💡' },
    { value: 'emergency', label: 'Emergency Alert', icon: '🚨' },
    { value: 'general', label: 'General', icon: '📢' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-600 bg-gray-100' },
    { value: 'medium', label: 'Medium', color: 'text-blue-600 bg-blue-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' },
  ];

  const quickTemplates = [
    {
      name: 'Appointment Reminder',
      title: 'Upcoming Appointment Reminder',
      body: 'This is a reminder about your upcoming appointment. Please arrive 10 minutes early.',
      type: 'appointment_reminder',
    },
    {
      name: 'Medication Reminder',
      title: 'Time for Your Medication',
      body: 'Please remember to take your prescribed medication as directed.',
      type: 'medication_reminder',
    },
    {
      name: 'Lab Results Ready',
      title: 'Your Lab Results Are Ready',
      body: 'Your recent lab results are now available. Please check your patient portal or contact us.',
      type: 'doctor_message',
    },
    {
      name: 'Health Tip',
      title: 'Daily Health Tip',
      body: 'Stay hydrated! Drink at least 8 glasses of water daily for optimal health.',
      type: 'health_tip',
    },
  ];

  const handleInputChange = (field: keyof SendNotificationForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserIdsChange = (value: string) => {
    const ids = value.split(',').map((id) => id.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, userIds: ids }));
  };

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setForm((prev) => ({
      ...prev,
      title: template.title,
      body: template.body,
      type: template.type,
    }));
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    if (form.recipientType === 'single' && !form.userId.trim()) {
      toast.error('Please enter a patient ID');
      return;
    }

    if (form.recipientType === 'multiple' && form.userIds.length === 0) {
      toast.error('Please enter at least one patient ID');
      return;
    }

    setSending(true);
    try {
      let success = false;
      let count = 0;

      if (form.recipientType === 'single') {
        success = await notificationService.sendNotification({
          userId: form.userId,
          title: form.title,
          body: form.body,
          type: form.type as NotificationType,
          data: {
            priority: form.priority,
            sentBy: user?.id,
            sentByName: `Dr. ${user?.firstName} ${user?.lastName}`,
          },
          actionUrl: form.actionUrl || undefined,
          scheduledFor: form.scheduledFor || undefined,
        });
        count = success ? 1 : 0;
      } else if (form.recipientType === 'multiple') {
        // Send to multiple users
        const promises = form.userIds.map((userId) =>
          notificationService.sendNotification({
            userId,
            title: form.title,
            body: form.body,
            type: form.type as NotificationType,
            data: {
              priority: form.priority,
              sentBy: user?.id,
              sentByName: `Dr. ${user?.firstName} ${user?.lastName}`,
            },
            actionUrl: form.actionUrl || undefined,
            scheduledFor: form.scheduledFor || undefined,
          })
        );
        const results = await Promise.all(promises);
        count = results.filter(Boolean).length;
        success = count > 0;
      } else {
        // Broadcast to all (would need a broadcast endpoint)
        toast.error('Broadcast functionality coming soon!');
        setSending(false);
        return;
      }

      if (success) {
        toast.success(
          `Notification${count > 1 ? 's' : ''} sent successfully to ${count} patient${count > 1 ? 's' : ''}!`,
          { duration: 4000 }
        );
        setSentCount((prev) => prev + count);
        
        // Reset form
        setForm({
          recipientType: 'single',
          userId: '',
          userIds: [],
          title: '',
          body: '',
          type: 'doctor_message',
          priority: 'medium',
          scheduledFor: '',
          actionUrl: '',
        });
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('An error occurred while sending notification');
    } finally {
      setSending(false);
    }
  };

  if (!user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            This page is only accessible to doctors. Please contact support if you believe this is an error.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BellIcon className="h-8 w-8 text-primary-maroon" />
            <h1 className="text-3xl font-bold text-gray-900">Send Notifications</h1>
          </div>
          <p className="text-gray-600">
            Send notifications to your patients about appointments, health tips, and more.
          </p>
          {sentCount > 0 && (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="font-medium">{sentCount} notification{sentCount > 1 ? 's' : ''} sent today</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Templates Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
              <div className="space-y-2">
                {quickTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-pink hover:bg-primary-pink/5 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.body}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSendNotification} className="space-y-6">
                {/* Recipient Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Send To
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('recipientType', 'single')}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        form.recipientType === 'single'
                          ? 'border-primary-maroon bg-primary-pink/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UserIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Single Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('recipientType', 'multiple')}
                      className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                        form.recipientType === 'multiple'
                          ? 'border-primary-maroon bg-primary-pink/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UsersIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">Multiple</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('recipientType', 'all')}
                      disabled
                      className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
                    >
                      <UsersIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">All Patients</span>
                      <span className="text-xs text-gray-500 mt-1">(Coming Soon)</span>
                    </button>
                  </div>
                </div>

                {/* Patient ID(s) */}
                {form.recipientType === 'single' && (
                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      id="userId"
                      value={form.userId}
                      onChange={(e) => handleInputChange('userId', e.target.value)}
                      placeholder="Enter patient ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">Enter the unique ID of the patient</p>
                  </div>
                )}

                {form.recipientType === 'multiple' && (
                  <div>
                    <label htmlFor="userIds" className="block text-sm font-medium text-gray-700 mb-2">
                      Patient IDs
                    </label>
                    <textarea
                      id="userIds"
                      value={form.userIds.join(', ')}
                      onChange={(e) => handleUserIdsChange(e.target.value)}
                      placeholder="Enter patient IDs separated by commas"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Example: patient1, patient2, patient3
                    </p>
                  </div>
                )}

                {/* Notification Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {notificationTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          form.type === type.value
                            ? 'border-primary-maroon bg-primary-pink/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {priorityOptions.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.value)}
                        className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                          form.priority === priority.value
                            ? `border-current ${priority.color}`
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter notification title"
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{form.title.length}/100 characters</p>
                </div>

                {/* Body */}
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="body"
                    value={form.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder="Enter your message here..."
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">{form.body.length}/500 characters</p>
                </div>

                {/* Schedule (Optional) */}
                <div>
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule For (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      id="scheduledFor"
                      value={form.scheduledFor}
                      onChange={(e) => handleInputChange('scheduledFor', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Leave empty to send immediately
                  </p>
                </div>

                {/* Action URL (Optional) */}
                <div>
                  <label htmlFor="actionUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Action URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="actionUrl"
                    value={form.actionUrl}
                    onChange={(e) => handleInputChange('actionUrl', e.target.value)}
                    placeholder="https://example.com/action"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-maroon focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Link to redirect when notification is clicked
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 bg-primary-maroon hover:bg-primary-maroon/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    {sending ? 'Sending...' : form.scheduledFor ? 'Schedule Notification' : 'Send Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        recipientType: 'single',
                        userId: '',
                        userIds: [],
                        title: '',
                        body: '',
                        type: 'doctor_message',
                        priority: 'medium',
                        scheduledFor: '',
                        actionUrl: '',
                      })
                    }
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationsPage;
