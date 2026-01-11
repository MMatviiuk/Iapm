import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  type Auth,
} from 'firebase/auth';
import {
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let persistenceReady = false;

export const isFirebaseConfigured = () => {
  const env = import.meta.env;
  return Boolean(
    env?.VITE_FIREBASE_API_KEY &&
      env?.VITE_FIREBASE_AUTH_DOMAIN &&
      env?.VITE_FIREBASE_PROJECT_ID
  );
};

const getFirebaseConfig = () => {
  const env = import.meta.env;

  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
};

export const getFirebaseApp = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }

  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }

  return authInstance;
};

export const getFirestoreDb = () => {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }

  return firestoreInstance;
};

export const configureAuthPersistence = async (rememberMe: boolean) => {
  const auth = getFirebaseAuth();
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
};

export const enableFirestoreOffline = async () => {
  if (persistenceReady) return;

  const db = getFirestoreDb();

  try {
    await enableIndexedDbPersistence(db);
    persistenceReady = true;
  } catch (error) {
    await enableMultiTabIndexedDbPersistence(db).catch(() => {
      persistenceReady = true;
    });
  }
};
