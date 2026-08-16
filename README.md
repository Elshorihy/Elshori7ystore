# Elshori7y

منصة عربية للتطبيقات والمجتمع والذكاء الاصطناعي، مبنية بـ React + Vite + Firebase، ومجهزة للنشر على Cloudflare Pages.

## 1) المتطلبات
- Node.js 20+
- مشروع Firebase
- GitHub (اختياري للنشر التلقائي)
- حساب Cloudflare

## 2) تشغيل محليًا
```bash
npm install
npm run dev
```

## 3) إعداد Firebase
1. أنشئ Web App داخل Firebase.
2. فعّل Authentication > Email/Password.
3. أنشئ Firestore Database.
4. فعّل Storage.
5. افتح `public/config.js` وضع بيانات Web App بدل القيم `PUT_*`.
6. طبّق `firestore.rules` و`storage.rules` من Firebase Console أو Firebase CLI.

> بيانات Firebase Web config ليست أسرار خادم. لا تضع Firebase Admin SDK credentials أو service account في المشروع الأمامي.

## 4) إنشاء أول Admin
الأفضل إنشاء المستخدم أولًا، ثم تعديل حقل `role` يدويًا في Firestore إلى `admin` من Console. بعد ذلك يستطيع المشرف إدارة الأدوار والتطبيقات والمنشورات.

## 5) Firestore
المجموعات المستخدمة:
- `users`
- `posts`
- `posts/{postId}/comments`
- `apps`
- `users/{uid}/notifications`
- `reports`
- `downloads`
- `categories`

بعض استعلامات Firestore قد تطلب Index عند أول تشغيل. Firebase سيعطيك رابط إنشاء الـIndex المطلوب في رسالة الخطأ؛ أنشئه مرة واحدة.

## 6) AI
الواجهة لا تحتوي على API key. يمكن ربطها لاحقًا بنقطة اتصال آمنة مثل Cloudflare Worker أو backend عبر `VITE_AI_ENDPOINT` أثناء التطوير. لا تضع مفتاح OpenAI أو أي مزود داخل React.

## 7) Build
```bash
npm run build
```
الناتج داخل `dist/`.

## 8) Cloudflare Pages
- اربط GitHub repository.
- Framework preset: Vite.
- Build command: `npm run build`.
- Build output directory: `dist`.
- لا تحتاج Worker binding.
- `wrangler.jsonc` موجود فقط لتوضيح إعداد Pages ولا يعتمد التطبيق على Worker runtime.

إذا احتجت SPA fallback، Cloudflare Pages يتعامل مع مسارات SPA عند النشر. في حال استخدام إعداد استضافة مختلف، تأكد من إعادة توجيه المسارات إلى `index.html`.

## 9) GitHub
```bash
git init
git add .
git commit -m "Initial Elshori7y platform"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## 10) الوظائف الحالية
- Authentication: تسجيل/دخول/خروج/استعادة كلمة المرور.
- Profiles: بيانات المستخدم وأدواره وإحصاءاته الأساسية.
- Community: إنشاء منشورات، قراءة، إعجاب، تعليقات، حذف المنشور بواسطة صاحبه/الإدارة.
- Store: عرض التطبيقات والبحث والتصنيف والترتيب والتفاصيل.
- Developer: إضافة تطبيقات مع رفع أيقونة إلى Firebase Storage وإرسالها للمراجعة.
- Admin: إدارة المستخدمين والأدوار والتطبيقات والمنشورات.
- Notifications: مركز إشعارات Firestore.
- AI: واجهة محادثة مع نقطة اتصال آمنة قابلة للضبط.
- Responsive RTL Dark UI.

## 11) ملاحظات إنتاجية مهمة
- قواعد Firestore تمنع المستخدم من تعديل دور نفسه إلى admin.
- قواعد Storage تقيد الصور حسب المستخدم والحجم والنوع.
- روابط تحميل التطبيقات خارج Firebase يجب أن تكون روابط موثوقة؛ التحقق الأمني من محتوى APK/ZIP يحتاج خدمة فحص على الخادم قبل الإتاحة العامة.
- للمحتوى واسع النطاق، أضف Cloud Functions/Workers لإنشاء الإشعارات، تحديث العدادات، ومهام moderation بدل تنفيذ كل شيء من المتصفح.
