import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBnu236YAadj8_WNWGRYzo94eXfBjx83QQ",
  authDomain: "arenamind-8886e.firebaseapp.com",
  projectId: "arenamind-8886e",
  storageBucket: "arenamind-8886e.firebasestorage.app",
  messagingSenderId: "340021304391",
  appId: "1:340021304391:web:d42a56f777926365c66562"
};

// Initialize Firebase (Next.js singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, storage, provider, signInWithPopup };
