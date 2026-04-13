import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 🔥 Replace these with your actual Firebase project config
// Go to: Firebase Console → Project Settings → Your Apps → SDK setup
const firebaseConfig = {
  apiKey: "AIzaSyBzBkQjWacJ8_a7MspAX6VsxudlpHYSsSE",
  authDomain: "floodsense-4bbb9.firebaseapp.com",
  databaseURL: "https://floodsense-4bbb9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "floodsense-4bbb9",
  storageBucket: "floodsense-4bbb9.firebasestorage.app",
  messagingSenderId: "640090661253",
  appId: "1:640090661253:web:9367e076b53821383764ec"
};

// Initialize Firebase (prevents duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;