import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DEFAULT_MESSAGE = { 
  title: 'Family Notice', 
  content: '', 
  isActive: true,
  type: 'info'
};

export function useMessageCentre() {
  const [messageData, setMessageData] = useState(DEFAULT_MESSAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const primaryRef = doc(db, 'settings', 'messageCentre');
    const legacyRef = doc(db, 'systemSettings', 'messageCentre');

    const unsub = onSnapshot(primaryRef, 
      (docSnap) => {
        if (!isMounted) return;
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
          setLoading(false);
        } else {
          // Check legacy path
          getDoc(legacyRef).then(legacySnap => {
            if (!isMounted) return;
            if (legacySnap.exists()) {
              setMessageData(legacySnap.data());
            }
            setLoading(false);
          }).catch(() => {
            if (isMounted) setLoading(false);
          });
        }
      },
      (error) => {
        console.warn("Message centre listener fallback:", error);
        getDoc(legacyRef).then(legacySnap => {
          if (!isMounted) return;
          if (legacySnap.exists()) {
            setMessageData(legacySnap.data());
          }
          setLoading(false);
        }).catch(() => {
          if (isMounted) setLoading(false);
        });
      }
    );

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const saveMessage = async (newData) => {
    try {
      await setDoc(doc(db, 'settings', 'messageCentre'), newData, { merge: true });
    } catch (e) {
      console.error("Error saving message:", e);
    }
    try {
      await setDoc(doc(db, 'systemSettings', 'messageCentre'), newData, { merge: true });
    } catch (e) {}
  };

  return { messageData, loading, saveMessage };
}