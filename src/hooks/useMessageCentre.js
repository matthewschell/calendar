import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useMessageCentre() {
  const [messageData, setMessageData] = useState({ 
    title: 'Family Notice', 
    content: 'Welcome to the Family Calendar!', 
    isActive: true,
    type: 'info' // info, warning, success, important
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'messageCentre'), (docSnap) => {
      if (docSnap.exists()) {
        setMessageData(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveMessage = async (newData) => {
    await setDoc(doc(db, 'systemSettings', 'messageCentre'), newData);
  };

  return { messageData, loading, saveMessage };
}