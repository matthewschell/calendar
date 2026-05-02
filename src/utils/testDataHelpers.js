// src/utils/testDataHelpers.js
import { collection, getDocs, query, where, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const injectMarchAprilData = async () => {
  try {
    // 1. Fetch only the kids
    const membersSnap = await getDocs(collection(db, 'familyMembers'));
    const kids = membersSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(m => m.isKid === true || String(m.isKid).toLowerCase() === 'true')
      .map(k => k.id);

    if (kids.length === 0) {
      alert("No kids found to inject data for. Please add kids in the Family Members tab first.");
      return;
    }

    const ops = [];
    
    // JS Dates are 0-indexed for months. 2 = March, 3 = April.
    const start = new Date(2026, 2, 1); 
    const end = new Date(2026, 3, 30); 

    // 2. Loop through every day in March and April
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      kids.forEach(kidId => {
        // ~75% chance a kid did chores on any given day
        if (Math.random() > 0.25) {
          const choreRef = doc(collection(db, 'completions'));
          
          // Set the completion time to 2:00 PM for consistency
          const completionDate = new Date(d);
          completionDate.setHours(14, 0, 0, 0);

          ops.push((batch) => {
            batch.set(choreRef, {
              completedBy: kidId,
              points: Math.floor(Math.random() * 40) + 10, // Random payout between 10-50 pts
              timestamp: Timestamp.fromDate(completionDate),
              isTestData: true // FLAG: Makes it easy to delete later
            });
          });
        }
      });
    }

    // 3. Commit to Firestore in chunks (Firestore limits batches to 500 operations)
    const BATCH_SIZE = 450;
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      ops.slice(i, i + BATCH_SIZE).forEach(op => op(batch));
      await batch.commit();
    }

    alert(`Successfully injected ${ops.length} test completions for March and April 2026!`);
  } catch (error) {
    console.error("Error injecting test data:", error);
    alert("Failed to inject test data.");
  }
};

export const removeTestData = async () => {
  try {
    // 1. Query ONLY records that have our test flag
    const q = query(collection(db, 'completions'), where('isTestData', '==', true));
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("No test data found to remove.");
      return;
    }

    const ops = [];
    snap.forEach(docSnap => {
      ops.push((batch) => batch.delete(docSnap.ref));
    });

    // 2. Delete in chunks of 450
    const BATCH_SIZE = 450;
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      ops.slice(i, i + BATCH_SIZE).forEach(op => op(batch));
      await batch.commit();
    }

    alert(`Successfully removed ${ops.length} test completions! Your database is clean.`);
  } catch (error) {
    console.error("Error removing test data:", error);
    alert("Failed to remove test data.");
  }
};