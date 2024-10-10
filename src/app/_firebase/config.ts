import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
export const storage = getStorage(firebase_app);
export const provider = new GoogleAuthProvider();
export const admins = [
  {
    displayName: "Adesegun Adefunke",
    email: "adefunke16@gmail.com",
    userId: "6nND7Bh4jdhedfXnfOXvmM7Iwuv2",
  },
  {
    displayName: "Ajayi Ayobami",
    email: "lynxdm32@gmail.com",
    userId: "RpnOnCzRMZb790xizN1yl4U2JCK2",
  },
];

export default firebase_app;
