import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up a real-time listener on the calendarEvents collection
    const eventsRef = collection(db, 'calendarEvents');
    
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching calendar events:", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Helper to delete a single event
  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
    }
  };

  // Helper to delete a multi-day event group
  const deleteEventGroup = async (groupId) => {
    const groupEvents = events.filter(e => e.groupId === groupId);
    if (window.confirm(`This event spans ${groupEvents.length} days. Delete the entire event?`)) {
      const batch = writeBatch(db);
      groupEvents.forEach(event => {
        batch.delete(doc(db, 'calendarEvents', event.id));
      });
      await batch.commit();
    }
  };

  return { events, loading, deleteEvent, deleteEventGroup };
}