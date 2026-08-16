import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = window.ELSHORI7Y_FIREBASE_CONFIG;

if (!firebaseConfig || firebaseConfig.apiKey === 'PUT_API_KEY_HERE') {
  console.warn('Elshori7y: Firebase config is not configured yet. Update public/config.js.');
}

const app = initializeApp(firebaseConfig || {});
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
