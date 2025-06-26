// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAK6A-UDcemD2oUjBSGFnlyh5_BQvPvaWA",
  authDomain: "inventarioqr-e3a20.firebaseapp.com",
  projectId: "inventarioqr-e3a20",
  storageBucket: "inventarioqr-e3a20.appspot.com", 
  messagingSenderId: "642201390196",
  appId: "1:642201390196:web:bc124273cffdf7d2f6d521",
  measurementId: "G-DB99BQZPLT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);