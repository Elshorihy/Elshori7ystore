import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile } from './firestore';
const need=()=>{if(!auth) throw new Error('Firebase Authentication غير مُعد بعد.');};
export async function register({email,password,displayName,username}){need(); const c=await createUserWithEmailAndPassword(auth,email,password); await updateProfile(c.user,{displayName}); await createUserProfile(c.user.uid,{uid:c.user.uid,email,displayName,username,avatar:'',bio:''}); return c.user;}
export async function login(email,password){need(); return (await signInWithEmailAndPassword(auth,email,password)).user;}
export async function logout(){need(); return signOut(auth);}
export async function resetPassword(email){need(); return sendPasswordResetEmail(auth,email);}
