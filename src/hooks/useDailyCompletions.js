import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useDailyCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  
  const todayStr = useMidnightTick();

  useEffect(() => {
    const q = query(collection(db, 'completions'), where('date', '==', todayStr));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comps = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.choreId) {
          comps[data.choreId] = true;
          if (data.completedBy) {
            comps[`${data.choreId}_claimer`] = data.completedBy;
          }
        }
      });
      setCompletions(comps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [todayStr]);

  const toggleCompletion = async (chore, memberId, isCurrentlyDone) => {
    if (!memberId) return;
    const currentTodayStr = new Date().toDateString();
    const compId = `${chore.id}-${currentTodayStr}`;
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    const batch = writeBatch(db);
    const numericPoints = Number(chore.points) || 0;

    if (isCurrentlyDone) {
      batch.delete(compRef);
      batch.set(memberRef, { points: increment(-numericPoints) }, { merge: true });
    } else {
      batch.set(compRef, {
        choreId: chore.id,
        date: currentTodayStr,
        completedBy: memberId,
        points: numericPoints,
        timestamp: new Date()
      });
      batch.set(memberRef, { points: increment(numericPoints) }, { merge: true });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error toggling chore:", error);
      alert("Failed to update chore. Are you offline?");
    }
  };

  return { completions, loading, toggleCompletion };
}