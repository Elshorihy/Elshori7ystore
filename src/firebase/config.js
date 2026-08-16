import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = window.ELSHORI7Y_FIREBASE_CONFIG;
const isConfigured = Boolean(
  firebaseConfig?.apiKey &&
  firebaseConfig.apiKey !== 'PUT_API_KEY_HERE' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'PUT_PROJECT_ID_HERE'
);

if (!isConfigured) {
  console.warn('Elshori7y: Firebase is not configured yet. Update public/config.js.');
}

const app = isConfigured ? initializeApp(firebaseConfig) : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const firebaseReady = isConfigured;
export default app;
