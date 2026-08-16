import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
export async function uploadFile(file,path){ if(!storage) throw new Error('Firebase Storage غير مُعد.'); if(file.size>10*1024*1024) throw new Error('حجم الملف يتجاوز 10MB.'); if(!file.type.startsWith('image/')) throw new Error('يسمح برفع الصور فقط هنا.'); const r=ref(storage,`${path}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g,'_')}`); await uploadBytes(r,file); return getDownloadURL(r); }
