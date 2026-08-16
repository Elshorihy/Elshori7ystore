import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUser } from './firestore';

const C = createContext({ user: null, profile: null, loading: true });
export const useAuth = () => useContext(C);

function getPendingProfile(uid) {
  try {
    const raw = localStorage.getItem('elshori7y_pending_profile');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data?.uid === uid ? data : null;
  } catch (_) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Never keep the whole application behind a Firestore read.
      setLoading(false);

      const pending = getPendingProfile(u.uid);
      if (pending) setProfile(pending);
      else setProfile({
        uid: u.uid,
        email: u.email || '',
        displayName: u.displayName || 'مستخدم',
        username: (u.email || u.uid).split('@')[0].replace(/[^A-Za-z0-9_]/g, '').slice(0, 20) || `user_${u.uid.slice(0, 8)}`,
        avatar: '',
        bio: ''
      });

      try {
        const p = await getUser(u.uid);
        if (p) setProfile(p);
        else {
          const data = pending || {
            uid: u.uid,
            email: u.email || '',
            displayName: u.displayName || 'مستخدم',
            username: (u.email || u.uid).split('@')[0].replace(/[^A-Za-z0-9_]/g, '').slice(0, 20) || `user_${u.uid.slice(0, 8)}`,
            avatar: '',
            bio: ''
          };
          await createUserProfile(u.uid, data);
          setProfile(data);
          try { localStorage.removeItem('elshori7y_pending_profile'); } catch (_) {}
        }
      } catch (error) {
        console.warn('Elshori7y profile sync failed:', error);
      }
    });
  }, []);

  return <C.Provider value={{ user, profile, loading }}>{children}</C.Provider>;
}
