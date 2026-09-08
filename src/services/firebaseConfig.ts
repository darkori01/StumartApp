import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  browserLocalPersistence,
  // @ts-ignore
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBy0pVVlI1uaeH_52jC-YFZDyTiECbH-68",
  authDomain: "stumart-f68e0.firebaseapp.com",
  projectId: "stumart-f68e0",
  storageBucket: "stumart-f68e0.firebasestorage.app",
  messagingSenderId: "1017238700102",
  appId: "1:1017238700102:web:a9b1a7e2299387324f4a47"
};

const app = initializeApp(firebaseConfig);

// Auth with persistence — browser persistence on web, AsyncStorage on native.
const authPersistence = Platform.OS === 'web'
  ? browserLocalPersistence
  : getReactNativePersistence(AsyncStorage);

export const auth = initializeAuth(app, {
  persistence: authPersistence,
});

// Firestore — used for users, listings, offers, orders
export const db = getFirestore(app);

export default app;
