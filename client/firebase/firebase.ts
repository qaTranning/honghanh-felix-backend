// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCnA_TCKgEhnp6l2vdXHuCN5JLAemX8j2A',
  authDomain: 'felixzone-be171.firebaseapp.com',
  projectId: 'felixzone-be171',
  storageBucket: 'felixzone-be171.appspot.com',
  messagingSenderId: '343172509613',
  appId: '1:343172509613:web:f5d32be05329f346e67b24',
  measurementId: 'G-RXXMM8KGYC',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
export const firebaseAuth = getAuth();
