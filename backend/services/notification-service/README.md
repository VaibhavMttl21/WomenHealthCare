# Notification Service

A comprehensive notification service built with Google Firebase Cloud Messaging (FCM) for the Women Healthcare platform.

## Features

- ✅ Push notifications via Google FCM
- ✅ Multi-device support (Web, Android, iOS)
- ✅ Scheduled notifications
- ✅ Notification history and management
- ✅ Read/Unread status tracking
- ✅ Appointment reminders
- ✅ Doctor message notifications
- ✅ Bulk notifications
- ✅ Automatic token cleanup for invalid devices

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to Project Settings > Service Accounts
4. Generate a new private key (JSON file)
5. Extract the following values from the JSON:
   - `project_id`
   - `private_key`
   - `client_email`

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3004
NODE_ENV=development

DATABASE_URL="postgresql://user:password@localhost:5432/healthcaredb"
DIRECT_URL="postgresql://user:password@localhost:5432/healthcaredb"

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

CORS_ORIGIN=http://localhost:5173
```

### 4. Database Migration

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Token Management

#### Register Device Token
```http
POST /api/notifications/tokens/register
Content-Type: application/json

{
  "userId": "user123",
  "token": "fcm-device-token",
  "deviceType": "web",
  "deviceName": "Chrome on MacOS"
}
```

#### Unregister Device Token
```http
POST /api/notifications/tokens/unregister
Content-Type: application/json

{
  "token": "fcm-device-token"
}
```

### Send Notifications

#### Send to Single User
```http
POST /api/notifications/send
Content-Type: application/json

{
  "userId": "user123",
  "title": "Appointment Reminder",
  "body": "You have an appointment tomorrow at 10 AM",
  "type": "appointment_reminder",
  "data": {
    "appointmentId": "appt123"
  },
  "actionUrl": "/appointments/appt123",
  "scheduledFor": "2025-10-09T10:00:00Z"
}
```

#### Send to Multiple Users
```http
POST /api/notifications/send/bulk
Content-Type: application/json

{
  "userIds": ["user1", "user2", "user3"],
  "title": "Health Tip",
  "body": "Stay hydrated during pregnancy",
  "type": "health_tip"
}
```

#### Send Appointment Reminder
```http
POST /api/notifications/send/appointment-reminder
Content-Type: application/json

{
  "appointmentId": "appt123"
}
```

#### Send Doctor Message Notification
```http
POST /api/notifications/send/doctor-message
Content-Type: application/json

{
  "patientId": "user123",
  "doctorName": "Dr. Smith",
  "messagePreview": "Your test results are ready"
}
```

### Get Notifications

#### Get User Notifications
```http
GET /api/notifications/user/:userId?type=appointment&isRead=false&limit=20&offset=0
```

#### Get Unread Count
```http
GET /api/notifications/user/:userId/unread-count
```

### Update Notifications

#### Mark as Read
```http
PATCH /api/notifications/:notificationId/read
Content-Type: application/json

{
  "userId": "user123"
}
```

#### Mark All as Read
```http
PATCH /api/notifications/read-all
Content-Type: application/json

{
  "userId": "user123"
}
```

#### Delete Notification
```http
DELETE /api/notifications/:notificationId
Content-Type: application/json

{
  "userId": "user123"
}
```

## Notification Types

- `appointment` - New appointment scheduled
- `appointment_reminder` - Upcoming appointment reminder
- `appointment_cancelled` - Appointment cancelled
- `appointment_rescheduled` - Appointment rescheduled
- `doctor_message` - Message from doctor
- `medication_reminder` - Medication reminder
- `checkup_reminder` - Health checkup reminder
- `health_tip` - Health tips and advice
- `general` - General notifications
- `emergency` - Emergency alerts

## Scheduled Notifications

The service includes a cron job that runs every minute to check for scheduled notifications. Notifications with `scheduledFor` date in the past will be automatically sent.

## Architecture

```
notification-service/
├── src/
│   ├── config/
│   │   ├── firebase.config.ts    # Firebase Admin SDK initialization
│   │   └── database.config.ts    # Prisma client
│   ├── controllers/
│   │   └── notification.controller.ts
│   ├── services/
│   │   ├── fcm.service.ts        # FCM messaging logic
│   │   └── notification.service.ts # Business logic
│   ├── routes/
│   │   └── notification.routes.ts
│   ├── types/
│   │   └── notification.types.ts
│   ├── cron/
│   │   └── scheduler.ts          # Scheduled notifications
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── index.ts
└── package.json
```

## Extending the Service

### Adding New Notification Types

1. Add to `NotificationType` enum in `types/notification.types.ts`
2. Create a new method in `notification.service.ts`
3. Add a route in `routes/notification.routes.ts`

Example:
```typescript
async sendMedicationReminder(userId: string, medicationName: string): Promise<boolean> {
  await this.sendToUser({
    userId,
    notification: {
      title: '💊 Medication Reminder',
      body: `Time to take your ${medicationName}`,
      type: NotificationType.MEDICATION_REMINDER,
      data: { medicationName },
      actionUrl: '/medications',
    },
    saveToDatabase: true,
  });
  return true;
}
```

## Testing

Use tools like Postman or curl to test the API endpoints. Make sure to:

1. Register a device token first
2. Send a test notification
3. Check the notification appears in the frontend

## Troubleshooting

### No notifications received

1. Check Firebase credentials are correct
2. Verify device token is registered and active
3. Check browser/app has notification permissions enabled
4. Check Firebase console for any quota limits

### Invalid token errors

The service automatically marks invalid tokens as inactive. Users need to re-register their device tokens.

### Database errors

Run migrations:
```bash
npx prisma migrate dev
```

## License

MIT
