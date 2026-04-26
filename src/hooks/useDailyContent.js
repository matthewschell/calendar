import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useDailyContent() {
  const [content, setContent] = useState({ text: '', type: 'loading' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateId = `${month}-${day}`; // e.g., "04-25"

        // 1. Check for a Birthday or Holiday override
        const overrideRef = doc(db, 'dailyContent', dateId);
        const overrideSnap = await getDoc(overrideRef);

        if (overrideSnap.exists()) {
          setContent({ text: overrideSnap.data().text, type: 'override' });
          setLoading(false);
          return;
        }

        // 2. No Override today. Are we doing a Joke or a Fact?
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        if (dayOfYear % 2 === 0) {
          // EVEN DAY: Family-Friendly Dad Joke API (Cached for the day)
          const cachedDate = localStorage.getItem('daily_joke_date');
          
          if (cachedDate === dateId) {
            setContent({ text: localStorage.getItem('daily_joke_text'), type: 'joke' });
          } else {
            const jokeRes = await fetch('https://icanhazdadjoke.com/', {
              headers: { Accept: 'application/json' }
            });
            const jokeData = await jokeRes.json();
            
            // Save to browser storage so it doesn't change on refresh
            localStorage.setItem('daily_joke_date', dateId);
            localStorage.setItem('daily_joke_text', jokeData.joke);
            
            setContent({ text: jokeData.joke, type: 'joke' });
          }
          
        } else {
          // ODD DAY: Custom Fact from Firestore
          const factsRef = collection(db, 'dailyContent');
          const q = query(factsRef, where('type', '==', 'fact'));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Sort by ID to ensure absolute deterministic order
            const facts = querySnapshot.docs
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(d => d.data().text);
              
            // Pick a consistent fact based on the day of the year
            const deterministicFact = facts[dayOfYear % facts.length];
            setContent({ text: deterministicFact, type: 'fact' });
          } else {
            setContent({ text: "Did you know? Our database is currently empty!", type: 'fact' });
          }
        }
      } catch (error) {
        console.error("Error fetching daily content:", error);
        setContent({ text: "Why did the computer cross the road? To get to the other site!", type: 'joke' }); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading };
}