import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export async function registerUser(email, password, nombre) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: nombre,
  });
  return userCredential;
}

export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}