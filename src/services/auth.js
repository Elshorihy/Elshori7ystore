import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile } from './firestore';
const need=()=>{if(!auth) throw new Error('Firebase Authentication غير مُعد بعد.');};
const withTimeout=(promise,ms,message)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error(message)),ms))]);
export async function register({email,password,displayName,username}){
  need();
  const credential=await createUserWithEmailAndPassword(auth,email.trim(),password);
  const user=credential.user;
  await updateProfile(user,{displayName:displayName.trim()});
  try{
    await withTimeout(createUserProfile(user.uid,{uid:user.uid,email:user.email||email.trim(),displayName:displayName.trim(),username:username.trim().toLowerCase(),avatar:'',bio:''}),7000,'تم إنشاء الحساب، لكن حفظ الملف الشخصي استغرق وقتًا طويلًا. يمكنك المتابعة.');
  }catch(error){console.warn('Elshori7y profile creation delayed/failed:',error);}
  return user;
}
export async function login(email,password){need();return (await signInWithEmailAndPassword(auth,email.trim(),password)).user;}
export async function logout(){need();return signOut(auth);}
export async function resetPassword(email){need();return sendPasswordResetEmail(auth,email.trim());}
