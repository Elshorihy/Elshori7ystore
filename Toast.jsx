import {createContext,useContext,useMemo,useState} from 'react';
const C=createContext(null); export const useToast=()=>useContext(C);
export function ToastProvider({children}){const [items,setItems]=useState([]); const push=(message,type='success')=>{const id=Date.now()+Math.random();setItems(x=>[...x,{id,message,type}]);setTimeout(()=>setItems(x=>x.filter(i=>i.id!==id)),3500)}; const value=useMemo(()=>({push}),[]);return <C.Provider value={value}>{children}<div className="toast-stack">{items.map(i=><div key={i.id} className={`toast ${i.type}`}>{i.message}</div>)}</div></C.Provider>}
