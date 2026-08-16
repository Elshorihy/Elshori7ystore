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
  orderBy,
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

export async function getUser(uid) {
  needDb();
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function createUserProfile(uid, data) {
  needDb();
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    role: 'user',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    appsCount: 0
  }, { merge: true });
}

export async function getAppsData() {
  needDb();
  const q = query(
    collection(db, 'apps'),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc'),
    limit(30)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPosts() {
  needDb();
  const q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(30)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createPost(data) {
  needDb();
  return addDoc(collection(db, 'posts'), {
    ...data,
    status: 'published',
    likedBy: [],
    likeCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp()
  });
}

export async function deletePost(id) {
  needDb();
  return deleteDoc(doc(db, 'posts', id));
}

export async function toggleLike(postId, uid, liked, authorId) {
  needDb();
  const ref = doc(db, 'posts', postId);
  const result = await updateDoc(ref, {
    likedBy: liked ? arrayRemove(uid) : arrayUnion(uid),
    likeCount: increment(liked ? -1 : 1)
  });

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
  return addDoc(collection(db, 'apps'), {
    ...data,
    status: 'pending',
    downloads: 0,
    rating: 0,
    reviews: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateApp(id, data) {
  needDb();
  return updateDoc(doc(db, 'apps', id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}

export async function deleteApp(id) {
  needDb();
  return deleteDoc(doc(db, 'apps', id));
}

export async function addComment(postId, data, authorId) {
  needDb();
  const result = await addDoc(collection(db, 'posts', postId, 'comments'), {
    ...data,
    authorId: data.authorId,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) });

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
    orderBy('createdAt', 'asc'),
    limit(100)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createNotification(uid, data) {
  needDb();
  return addDoc(collection(db, 'users', uid, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp()
  });
}
