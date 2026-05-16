// src/hooks/useDailyContent.js
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useDailyContent() {
  const [content, setContent] = useState({ text: '', type: 'loading' });
  const [loading, setLoading] = useState(true);
  const todayStr = useMidnightTick();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateId = `${month}-${day}`;
        
        // 1. HARD OVERRIDE: Check for Special Days / Birthdays FIRST
        const overrideRef = doc(db, 'dailyContent', dateId);
        const overrideSnap = await getDoc(overrideRef);
        if (overrideSnap.exists()) {
          setContent({ text: overrideSnap.data().text, type: 'override' });
          setLoading(false);
          return; // Skip the rest of the logic entirely!
        }

        // 2. BULLETPROOF DATE MATH: Calculate exact integer days since epoch
        // Using Date.UTC at local midnight prevents Daylight Savings Time shifts 
        // from causing fractions that flip the day over mid-afternoon.
        const localMidnightUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const daysSinceEpoch = Math.floor(localMidnightUTC / 86400000);
        
        // 3. Alternate Days: Even days = Facts, Odd days = Jokes
        const isJokeDay = daysSinceEpoch % 2 === 1;

        if (isJokeDay) {
          // Check if we already fetched a joke for TODAY (prevents refresh re-rolls)
          const cachedDate = localStorage.getItem('daily_joke_date');
          if (cachedDate === dateId) {
            setContent({ text: localStorage.getItem('daily_joke_text'), type: 'joke' });
          } else {
            // FIX: Added cache: 'no-store' so the browser doesn't feed us a repeating cached joke!
            const jokeRes = await fetch('https://icanhazdadjoke.com/', { 
              headers: { Accept: 'application/json' },
              cache: 'no-store'
            });
            const jokeData = await jokeRes.json();
            
            localStorage.setItem('daily_joke_date', dateId);
            localStorage.setItem('daily_joke_text', jokeData.joke);
            setContent({ text: jokeData.joke, type: 'joke' });
          }
        } else {
          // FETCH FACTS
          const factsRef = collection(db, 'dailyContent');
          const q = query(factsRef, where('type', '==', 'fact'));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Sort by ID to ensure all devices have the exact same array order
            const facts = querySnapshot.docs
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(d => d.data().text);
            
            // FIX: Deterministic picking. Steps through the array 1 by 1 based on the date.
            // Never repeats until the entire list has been shown!
            const deterministicFact = facts[daysSinceEpoch % facts.length];
            setContent({ text: deterministicFact, type: 'fact' });
          } else {
            setContent({ text: "Did you know? Our database is currently empty! Add some facts in the admin panel.", type: 'fact' });
          }
        }
      } catch (error) {
        console.error("Error fetching daily content:", error);
        setContent({ text: "Why did the computer cross the road? To get to the other site!", type: 'joke' });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [todayStr]);

  return { content, loading };
}