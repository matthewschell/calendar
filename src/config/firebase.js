// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // Old legacy DB
import { getFirestore } from 'firebase/firestore'; // New atomic DB
import { getStorage } from 'firebase/storage'; // Added for the new Avatar uploads

const firebaseConfig = {
  apiKey: "AIzaSyDg-I2BAuXt2sHDJa-ih-B6z5km8HlOl0U",
  authDomain: "family-calendar-ebf3b.firebaseapp.com",
  databaseURL: "https://family-calendar-ebf3b-default-rtdb.firebaseio.com",
  projectId: "family-calendar-ebf3b",
  storageBucket: "family-calendar-ebf3b.firebasestorage.app",
  messagingSenderId: "964895867498",
  appId: "1:964895867498:web:f69b0c636201303a3e4013"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export all database instances so our hooks can use them
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);