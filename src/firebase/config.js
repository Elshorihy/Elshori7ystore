import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = window.ELSHORI7Y_FIREBASE_CONFIG;
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

const isConfigured = Boolean(
  firebaseConfig &&
  requiredKeys.every((key) => {
    const value = firebaseConfig[key];
    return typeof value === 'string' && value.trim() && !value.startsWith('PUT_');
  })
);

if (!isConfigured) {
  console.warn('Elshori7y: Firebase is not configured. Update public/config.js before using Firebase features.');
}

export const auth = isConfigured
  ? getAuth(getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const db = isConfigured
  ? getFirestore(getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const storage = isConfigured
  ? getStorage(getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

export const firebaseConfigured = isConfigured;
