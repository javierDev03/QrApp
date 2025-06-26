// src/services/firebaseMuebles.js
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export async function insertMueble(userId, mueble) {
  const docRef = await addDoc(collection(db, 'muebles'), { ...mueble, userId });
  return docRef.id;
}

export async function getMuebles(userId) {
  const mueblesRef = collection(db, 'muebles');
  const q = query(mueblesRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateMueble(id, mueble) {
  const ref = doc(db, 'muebles', id);
  await updateDoc(ref, mueble);
}

export async function deleteMueble(id) {
  await deleteDoc(doc(db, 'muebles', id));
}