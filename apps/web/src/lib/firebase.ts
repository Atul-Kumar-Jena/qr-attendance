import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY             || 'AIzaSyB15t0bE5Q_0hlBUnA6qlDHmYf-EijcWvg',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         || 'attendly-the-solution.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID          || 'attendly-the-solution',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      || 'attendly-the-solution.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1076860949595',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID              || '1:1076860949595:web:4014332de453c2d6cedb7e',
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]
  : null;

export const auth = app ? getAuth(app) : null;
export const db   = app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();
export { isConfigured };

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase not configured');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser() {
  if (!auth) return;
  await signOut(auth);
}
