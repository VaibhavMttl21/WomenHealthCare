import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

try {
  // Check if service account key is provided
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountPath) {
    // Initialize with service account key file
    const serviceAccount = require(serviceAccountPath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } else {
    // Initialize with individual credentials (fallback)
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  throw error;
}

// Get Firebase Storage bucket
export const bucket = admin.storage().bucket();

export default firebaseApp;
