import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useDailyCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);

  // Get a consistent string for today (e.g., "Mon Apr 26 2026")
  const todayStr = new Date().toDateString();

  useEffect(() => {
    // Only listen to completions for TODAY
    const q = query(collection(db, 'completions'), where('date', '==', todayStr));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comps = {};
      snapshot.forEach(doc => {
        // Map the choreId to 'true' so our UI knows it's done
        comps[doc.data().choreId] = true;
      });
      setCompletions(comps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [todayStr]);

  const toggleCompletion = async (chore, memberId, isCurrentlyDone) => {
    // Unique ID for this specific completion (e.g., "dishwasher-Mon Apr 26 2026")
    const compId = `${chore.id}-${todayStr}`;
    
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    // A Batch ensures both writes happen at the exact same time, or neither do
    const batch = writeBatch(db);

    if (isCurrentlyDone) {
      // Unchecking the chore: Delete the completion record and deduct points atomically
      batch.delete(compRef);
      batch.update(memberRef, { score: increment(-chore.points) });
    } else {
      // Checking the chore: Create the record and add points atomically
      batch.set(compRef, {
        choreId: chore.id,
        date: todayStr,
        completedBy: memberId,
        points: chore.points,
        timestamp: new Date()
      });
      batch.update(memberRef, { score: increment(chore.points) });
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