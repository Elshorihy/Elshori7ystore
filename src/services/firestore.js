import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  where,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase/config';

const needDb = () => {
  if (!db) throw new Error('Firebase غير مُعد بعد. ضع بيانات Firebase في public/config.js');
};

const withTimeout = (promise, ms, message) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
]);

const sortNewest = (items) => items.sort((a, b) => {
  const av = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds ?? 0;
  const bv = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds ?? 0;
  return bv - av;
});

export async function getUser(uid) {
  needDb();
  const snapshot = await withTimeout(
    getDoc(doc(db, 'users', uid)),
    10000,
    'تعذر تحميل بيانات الحساب. تحقق من اتصال Firebase.'
  );
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function createUserProfile(uid, data) {
  needDb();
  await withTimeout(
    setDoc(doc(db, 'users', uid), {
      ...data,
      uid,
      createdAt: serverTimestamp(),
      role: 'user',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      appsCount: 0
    }, { merge: true }),
    10000,
    'تعذر حفظ الملف الشخصي. تحقق من اتصال Firestore وقواعد الأمان.'
  );
}

export async function getAppsData() {
  needDb();
  // Keep the query simple so the site does not depend on a manually-created
  // composite Firestore index. Sorting is done locally after the small result set.
  const q = query(
    collection(db, 'apps'),
    where('status', '==', 'approved'),
    limit(30)
  );
  const snapshot = await withTimeout(
    getDocs(q),
    10000,
    'تعذر تحميل التطبيقات حاليًا.'
  );
  return sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPosts() {
  needDb();
  // Avoid a composite index requirement. The feed is capped before client sorting.
  const q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    limit(30)
  );
  const snapshot = await withTimeout(
    getDocs(q),
    10000,
    'تعذر تحميل المنشورات حاليًا.'
  );
  return sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function createPost(data) {
  needDb();
  return withTimeout(
    addDoc(collection(db, 'posts'), {
      ...data,
      status: 'published',
      likedBy: [],
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp()
    }),
    10000,
    'تعذر نشر المنشور. تحقق من تسجيل الدخول واتصال Firebase.'
  );
}

export async function deletePost(id) {
  needDb();
  return withTimeout(deleteDoc(doc(db, 'posts', id)), 10000, 'تعذر حذف المنشور.');
}

export async function toggleLike(postId, uid, liked, authorId) {
  needDb();
  const ref = doc(db, 'posts', postId);
  const result = await withTimeout(updateDoc(ref, {
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
    likeCount: increment(liked ? -1 : 1)
  }), 10000, 'تعذر تحديث الإعجاب.');

  if (!liked && authorId && authorId !== uid) {
    await createNotification(authorId, {
      type: 'like',
      title: 'إعجاب جديد',
      body: 'أعجب أحد المستخدمين بمنشورك',
      postId,
      actorId: uid
    });
  }
  return result;
}

export async function createApp(data) {
  needDb();
  return withTimeout(addDoc(collection(db, 'apps'), {
    ...data,
    status: 'pending',
    downloads: 0,
    rating: 0,
    reviews: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }), 10000, 'تعذر إرسال التطبيق للمراجعة.');
}

export async function updateApp(id, data) {
  needDb();
  return withTimeout(updateDoc(doc(db, 'apps', id), {
    ...data,
    updatedAt: serverTimestamp()
  }), 10000, 'تعذر تحديث التطبيق.');
}

export async function deleteApp(id) {
  needDb();
  return withTimeout(deleteDoc(doc(db, 'apps', id)), 10000, 'تعذر حذف التطبيق.');
}

export async function addComment(postId, data, authorId) {
  needDb();
  const result = await withTimeout(addDoc(collection(db, 'posts', postId, 'comments'), {
    ...data,
    authorId: data.authorId,
    createdAt: serverTimestamp()
  }), 10000, 'تعذر إضافة التعليق.');

  await withTimeout(
    updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) }),
    10000,
    'تم إرسال التعليق لكن تعذر تحديث العدد.'
  );

  if (authorId && authorId !== data.authorId) {
    await createNotification(authorId, {
      type: 'comment',
      title: 'تعليق جديد',
      body: 'تمت إضافة تعليق على منشورك',
      postId,
      actorId: data.authorId
    });
  }
  return result;
}

export async function getComments(postId) {
  needDb();
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    limit(100)
  );
  const snapshot = await withTimeout(getDocs(q), 10000, 'تعذر تحميل التعليقات.');
  return sortNewest(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))).reverse();
}

export async function createNotification(uid, data) {
  needDb();
  return withTimeout(addDoc(collection(db, 'users', uid, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp()
  }), 10000, 'تعذر إنشاء الإشعار.');
}
