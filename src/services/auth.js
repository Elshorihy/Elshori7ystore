import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile } from './firestore';

const need = () => {
  if (!auth) throw new Error('Firebase Authentication غير مُعد بعد.');
};

export async function register({ email, password, displayName, username }) {
  need();
  const cleanEmail = email.trim();
  const cleanName = displayName.trim();
  const cleanUsername = username.trim().toLowerCase();

  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const user = credential.user;
  await updateProfile(user, { displayName: cleanName });

  const profile = {
    uid: user.uid,
    email: user.email || cleanEmail,
    displayName: cleanName,
    username: cleanUsername,
    avatar: '',
    bio: ''
  };

  try { localStorage.setItem('elshori7y_pending_profile', JSON.stringify(profile)); } catch (_) {}

  // Do not block successful authentication on a slow Firestore write.
  createUserProfile(user.uid, profile)
    .then(() => { try { localStorage.removeItem('elshori7y_pending_profile'); } catch (_) {} })
    .catch((error) => console.warn('Elshori7y profile will be retried:', error));

  return user;
}

export async function login(email, password) {
  need();
  return (await signInWithEmailAndPassword(auth, email.trim(), password)).user;
}

export async function logout() { need(); return signOut(auth); }
export async function resetPassword(email) { need(); return sendPasswordResetEmail(auth, email.trim()); }
