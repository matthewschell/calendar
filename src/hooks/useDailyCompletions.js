import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useDailyCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toDateString();

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
    const compId = `${chore.id}-${todayStr}`;
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    const batch = writeBatch(db);

    if (isCurrentlyDone) {
      batch.delete(compRef);
      // FIXED: changed "score" to "points" so it triggers the Leaderboard
      batch.update(memberRef, { points: increment(-chore.points) });
    } else {
      batch.set(compRef, {
        choreId: chore.id,
        date: todayStr,
        completedBy: memberId,
        points: chore.points,
        timestamp: new Date()
      });
      // FIXED: changed "score" to "points"
      batch.update(memberRef, { points: increment(chore.points) });
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