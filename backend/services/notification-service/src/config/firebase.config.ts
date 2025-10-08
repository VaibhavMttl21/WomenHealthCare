import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      return admin.app();
    }

    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('Firebase credentials not fully configured. Push notifications will be disabled.');
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return admin.app();
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    return null;
  }
};

export const firebaseApp = initializeFirebase();
export const messaging = firebaseApp ? admin.messaging() : null;
