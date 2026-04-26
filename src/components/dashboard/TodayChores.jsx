import { useState, useEffect } from 'react';
import { ClipboardList, Star, CheckCircle, Circle } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import confetti from 'canvas-confetti';

export default function TodayChores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { members } = useFamilyMembers();

  // 1. Listen for today's chores in the database
  useEffect(() => {
    const q = query(collection(db, 'dailyChores'));
    const unsub = onSnapshot(q, (snapshot) => {
      const choreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChores(choreData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. The Mega Confetti Blast Function
  const triggerMegaConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // 3. Handle Chore Click (Points + Database Sync)
  const handleToggleChore = async (chore) => {
    try {
      const newStatus = !chore.completed;
      
      // If we are checking it off, add points. If unchecking, subtract points.
      const pointDiff = newStatus ? chore.points : -chore.points;

      // Update the chore status in Firestore
      await updateDoc(doc(db, 'dailyChores', chore.id), { completed: newStatus });

      // Atomically add/subtract points from the family member's profile
      if (chore.memberId) {
        await updateDoc(doc(db, 'familyMembers', chore.memberId), { 
          points: increment(pointDiff) 
        });
      }

      // Check if this kid just finished ALL their chores for the Mega Blast!
      if (newStatus === true && chore.memberId) {
        const kidChores = chores.filter(c => c.memberId === chore.memberId);
        // We evaluate against the current state, assuming the clicked chore is now true
        const allDone = kidChores.every(c => c.id === chore.id ? true : c.completed);
        
        if (allDone && kidChores.length > 0) {
          triggerMegaConfetti();
        }
      }
    } catch (error) {
      console.error("Error updating chore:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-full animate-pulse min-h-62.5">
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3"><div className="h-12 bg-slate-100 rounded-xl"></div></div>
      </div>
    );
  }

  // Group chores by Kid
  const choresByKid = chores.reduce((acc, chore) => {
    if (!acc[chore.memberId]) acc[chore.memberId] = [];
    acc[chore.memberId].push(chore);
    return acc;
  }, {});

  // Only show kids who actually have chores assigned today
  const kidsWithChores = members.filter(m => choresByKid[m.id] && choresByKid[m.id].length > 0);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-0">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
        <ClipboardList className="text-indigo-500 w-6 h-6" /> Today's Chores
      </h2>

      <div className="flex-1 overflow-y-auto hide-scrollbar pr-2 space-y-6">
        {kidsWithChores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-4xl mb-2">✨</span>
            <span className="text-sm font-bold text-slate-500">No chores right now!</span>
          </div>
        ) : (
          kidsWithChores.map(kid => (
            <div key={kid.id}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: kid.color || '#94a3b8' }}>
                {kid.name}'s Chores
              </h3>
              <div className="flex flex-col gap-2">
                {choresByKid[kid.id].map(chore => (
                  <div 
                    key={chore.id}
                    onClick={() => handleToggleChore(chore)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      chore.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                    style={{ borderColor: !chore.completed ? `${kid.color}40` : '' }}
                  >
                    <div className="flex items-center gap-3">
                      {chore.completed ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                      )}
                      <span className={`font-bold ${chore.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {chore.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {chore.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}