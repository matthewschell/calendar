import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_CHORES } from '../constants/defaults';

export function useChores() {
  const [chores, setChores] = useState(DEFAULT_CHORES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const choresRef = collection(db, 'chores');
    
    const unsubscribe = onSnapshot(choresRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedChores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChores(fetchedChores);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chores:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { chores, loading };
}