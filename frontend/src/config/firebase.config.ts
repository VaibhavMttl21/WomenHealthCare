import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'your-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'your-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

// Initialize Firebase
let app;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Check if messaging is supported
  if ('Notification' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
  } else {
    console.warn('Push notifications are not supported in this browser');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { messaging, getToken, onMessage };
export default app;
