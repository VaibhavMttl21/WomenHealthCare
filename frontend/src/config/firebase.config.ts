import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Validate required environment variables
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_VAPID_KEY'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required Firebase environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('❌ Push notifications will not work until these are configured.');
    console.error('📖 See .env.example for required variables.');
    return false;
  }

  return true;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let messaging: Messaging | null = null;

try {
  // Validate configuration in development
  if (import.meta.env.DEV && !validateFirebaseConfig()) {
    console.warn('⚠️ Firebase configuration incomplete. Some features may not work.');
  }

  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  // Check if messaging is supported
  if ('Notification' in window && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
    console.log('✅ Firebase messaging initialized successfully');
  } else {
    console.warn('⚠️ Push notifications are not supported in this browser');
    console.warn('   - Notifications API:', 'Notification' in window);
    console.warn('   - Service Worker API:', 'serviceWorker' in navigator);
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  if (error instanceof Error) {
    console.error('❌ Error details:', error.message);
  }
}

// Export VAPID key for token generation
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export { messaging, getToken, onMessage };
export default app;
