# Elshori7y

منصة عربية للتطبيقات والمجتمع والذكاء الاصطناعي، مبنية بـ React + Vite + Firebase، ومجهزة للنشر على Cloudflare Pages.

## 1) المتطلبات
- Node.js 24+ (20+ يعمل أيضًا، وCI يستخدم Node 24)
- مشروع Firebase
- GitHub
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
6. طبّق `firestore.rules` و`storage.rules` و`firestore.indexes.json` من Firebase Console أو Firebase CLI.

> بيانات Firebase Web config ليست أسرار خادم. لا تضع Firebase Admin SDK credentials أو service account في المشروع الأمامي.

## 4) إنشاء أول Admin
أنشئ المستخدم أولًا، ثم عدّل حقل `role` يدويًا في Firestore إلى `admin` من Console. بعد ذلك يستطيع المشرف إدارة الأدوار والتطبيقات والمنشورات.

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

الاستعلامات الأساسية للتطبيقات والمنشورات لها Composite Index جاهز في `firestore.indexes.json`.

## 6) AI
الواجهة لا تحتوي على API key. يمكن ربطها لاحقًا بنقطة اتصال آمنة مثل Cloudflare Worker أو backend عبر متغير endpoint أثناء التطوير. لا تضع مفتاح OpenAI أو أي مزود داخل React.

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
- `wrangler.jsonc` موجود لتوضيح إعداد Pages فقط.
- `public/_redirects` يحتوي على SPA fallback: `/* /index.html 200` حتى تعمل روابط React Router عند فتحها مباشرة.

## 9) Firebase deployment
يوجد `firebase.json` جاهز لربط:
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

## 10) GitHub
المستودع يحتوي على GitHub Actions في `.github/workflows/build.yml`، ويشغّل `npm install` ثم `npm run build` مع كل Push إلى `main` وكل Pull Request.

## 11) الوظائف الحالية
- Authentication: تسجيل/دخول/خروج/استعادة كلمة المرور.
- Profiles: بيانات المستخدم وأدواره وإحصاءاته الأساسية.
- Community: إنشاء منشورات، قراءة، إعجاب، تعليقات، حذف المنشور بواسطة صاحبه/الإدارة.
- Store: عرض التطبيقات والبحث والتصنيف والتفاصيل.
- Developer: إضافة تطبيقات مع رفع أيقونة إلى Firebase Storage وإرسالها للمراجعة.
- Admin: إدارة المستخدمين والأدوار والتطبيقات والمنشورات.
- Notifications: مركز إشعارات Firestore.
- AI: واجهة محادثة مع نقطة اتصال آمنة قابلة للضبط.
- Responsive RTL Dark UI.

## 12) ملاحظات إنتاجية مهمة
- قواعد Firestore تمنع المستخدم من تعديل دوره أو ترقية نفسه إلى admin.
- قواعد Storage تقيد الصور حسب المستخدم والحجم والنوع.
- روابط تحميل التطبيقات الخارجية لا تمر عبر Firebase Storage إلا إذا رفعتها هناك؛ فحص APK/ZIP يحتاج خدمة فحص على الخادم قبل الإتاحة العامة.
- للمحتوى واسع النطاق، أضف Cloud Functions/Workers لمهام moderation والإشعارات الثقيلة بدل تنفيذها كلها من المتصفح.
