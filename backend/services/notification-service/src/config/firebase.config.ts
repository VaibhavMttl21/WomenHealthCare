import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const validateFirebaseConfig = () => {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required Firebase environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('❌ Push notifications will be disabled until these are configured.');
    console.error('📖 See .env.example for required variables.');
    return false;
  }

  return true;
};

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin SDK already initialized');
      return admin.app();
    }

    // Validate configuration first
    if (!validateFirebaseConfig()) {
      return null;
    }

    // Parse private key - remove quotes and replace escaped newlines
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!;
    
    // Remove surrounding quotes if present
    privateKey = privateKey.trim();
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || 
        (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }

    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Validate private key format
    if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----') || 
        !privateKey.endsWith('-----END PRIVATE KEY-----')) {
      console.error('❌ Invalid private key format. Must be a valid PEM private key.');
      console.error('❌ Private key should start with "-----BEGIN PRIVATE KEY-----" and end with "-----END PRIVATE KEY-----"');
      return null;
    }

    console.log('🔍 Firebase configuration validation:');
    console.log('   ✅ Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('   ✅ Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('   ✅ Private Key: Valid PEM format');

    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    console.log('📱 Push notifications are now enabled');
    return app;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
    }
    console.error('❌ Push notifications will be disabled');
    return null;
  }
};


// Get messaging instance
const getMessaging = () => {
  try {
    const app = initializeFirebase();
    if (!app) {
      console.error('❌ Cannot get messaging: Firebase app not initialized');
      return null;
    }
    const messagingInstance = admin.messaging(app);
    console.log('✅ Firebase Messaging instance created');
    return messagingInstance;
  } catch (error) {
    console.error('❌ Error getting messaging instance:', error);
    return null;
  }
};

export const firebaseApp = initializeFirebase();
export const messaging = getMessaging();
