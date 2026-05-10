import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useDailyCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  
  // FIX: Track today string in state to force midnight queries to update natively
  const [todayStr, setTodayStr] = useState(new Date().toDateString());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date().toDateString();
      if (current !== todayStr) setTodayStr(current);
    }, 60000);
    return () => clearInterval(interval);
  }, [todayStr]);

  useEffect(() => {
    const q = query(collection(db, 'completions'), where('date', '==', todayStr));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comps = {};
      snapshot.forEach(doc => {
        comps[doc.data().choreId] = true;
      });
      setCompletions(comps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [todayStr]);

  const toggleCompletion = async (chore, memberId, isCurrentlyDone) => {
    // FIX: Always capture the exact date at the moment of the click, 
    // circumventing any stale state closures entirely
    const currentTodayStr = new Date().toDateString();
    
    const compId = `${chore.id}-${currentTodayStr}`;
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    const batch = writeBatch(db);

    const numericPoints = Number(chore.points) || 0;

    if (isCurrentlyDone) {
      batch.delete(compRef);
      batch.update(memberRef, { points: increment(-numericPoints) });
    } else {
      batch.set(compRef, {
        choreId: chore.id,
        date: currentTodayStr,
        completedBy: memberId,
        points: numericPoints,
        timestamp: new Date()
      });
      batch.update(memberRef, { points: increment(numericPoints) });
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