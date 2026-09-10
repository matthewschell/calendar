import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // <-- NEW

const firebaseConfig = {
  apiKey: "AIzaSyDg-I2BAuXt2sHDJa-ih-B6z5km8HlOl0U",
  authDomain: "family-calendar-ebf3b.firebaseapp.com",
  databaseURL: "https://family-calendar-ebf3b-default-rtdb.firebaseio.com",
  projectId: "family-calendar-ebf3b",
  storageBucket: "family-calendar-ebf3b.firebasestorage.app",
  messagingSenderId: "964895867498",
  appId: "1:964895867498:web:f69b0c636201303a3e4013"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // <-- NEW