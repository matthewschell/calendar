import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useAdminPin() {
  const [adminPin, setAdminPin] = useState("8486");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().pin) {
        setAdminPin(docSnap.data().pin);
      }
    });
    return () => unsub();
  }, []);

  return adminPin;
}