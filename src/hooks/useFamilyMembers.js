import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_MEMBERS } from '../constants/defaults';

export function useFamilyMembers() {
  // We use your hardcoded defaults as the initial state so the screen is never blank
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membersRef = collection(db, 'familyMembers');
    
    // onSnapshot sets up a real-time listener. Any time the database changes, 
    // this instantly runs and updates our React state.
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedMembers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(fetchedMembers);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching family members:", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { members, loading };
}