export const cn = (...v) => v.filter(Boolean).join(' ');
export const formatDate = (value) => { if (!value) return 'الآن'; const d = value?.toDate ? value.toDate() : new Date(value); return new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium'}).format(d); };
export const formatCount = (n=0) => new Intl.NumberFormat('ar-EG',{notation:'compact',maximumFractionDigits:1}).format(n);
export const slugify = (s='') => s.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/(^-|-$)/g,'');
export const initials = (name='مستخدم') => name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
