import {createContext,useContext,useEffect,useState} from 'react';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../firebase/config';
import {createUserProfile,getUser} from './firestore';
const C=createContext({user:null,profile:null,loading:true});
export const useAuth=()=>useContext(C);
export function AuthProvider({children}){
  const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{
    if(!auth){setLoading(false);return;}
    return onAuthStateChanged(auth,async u=>{
      setUser(u);
      if(!u){setProfile(null);setLoading(false);return;}
      try{
        let p=await getUser(u.uid);
        if(!p){
          await createUserProfile(u.uid,{uid:u.uid,email:u.email||'',displayName:u.displayName||'',username:(u.email||u.uid).split('@')[0].replace(/[^A-Za-z0-9_]/g,'').slice(0,20)||`user_${u.uid.slice(0,8)}`,avatar:'',bio:''});
          p=await getUser(u.uid);
        }
        setProfile(p);
      }catch(error){
        console.warn('Elshori7y profile load/create failed:',error);
        setProfile(null);
      }finally{setLoading(false);}
    });
  },[]);
  return <C.Provider value={{user,profile,loading}}>{children}</C.Provider>;
}
