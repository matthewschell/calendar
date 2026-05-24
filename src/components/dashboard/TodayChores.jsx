import { useState, useEffect } from 'react';
import { ClipboardList, Star, CheckCircle, Circle } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import confetti from 'canvas-confetti';

export default function TodayChores() {
  const [chores, setChores] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const { members } = useFamilyMembers();

  useEffect(() => {
    // Lock the query boundaries to exactly today (midnight to 11:59 PM)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const unsubChores = onSnapshot(collection(db, 'chores'), (snapshot) => {
      setChores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qCompletions = query(
      collection(db, 'completions'),
      where('timestamp', '>=', todayStart),
      where('timestamp', '<=', todayEnd)
    );
    const unsubComps = onSnapshot(qCompletions, (snapshot) => {
      setCompletions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOverrides = onSnapshot(collection(db, 'dailyOverrides'), (snapshot) => {
      const ov = {};
      snapshot.docs.forEach(doc => { ov[doc.id] = doc.data(); });
      setOverrides(ov);
      setLoading(false);
    });

    return () => {
      unsubChores();
      unsubComps();
      unsubOverrides();
    };
  }, []);

  const triggerMegaConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const getLocalIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check custody schedules and manual overrides
  const participatesInChoresHereOnDate = (kid, dateObj) => {
    const isoDate = getLocalIsoDate(dateObj);
    if (overrides[isoDate] && overrides[isoDate][kid.id] !== undefined) {
      return overrides[isoDate][kid.id];
    }
    if (!kid || !kid.schedule || !kid.schedule.pattern || kid.schedule.pattern.length === 0) return true;
    if (!kid.schedule.referenceDate) return true;

    const pattern = kid.schedule.pattern;
    const cycleLength = pattern.length;
    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);
    const [refY, refM, refD] = kid.schedule.referenceDate.split('-');
    const refDate = new Date(refY, refM - 1, refD);
    refDate.setHours(0, 0, 0, 0);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.round((target - refDate) / msPerDay);
    const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength;
    return pattern[cycleDay];
  };

  // Complex frequency filtering mapped explicitly to today's date
  const isApplicableToday = (chore, kidId) => {
    if (chore.isArchived) return false;
    if (chore.assignedTo !== kidId) return false;
    
    const today = new Date();
    const targetDay = today.getDay();

    if (chore.frequency === 'today-only') {
      return chore.createdDate === today.toDateString();
    } else if (chore.frequency === 'daily' || !chore.frequency) {
      return true;
    } else if (chore.frequency === 'weekly') {
      if (chore.days && chore.days.includes(targetDay)) return true;
      if (chore.weekDay !== null && chore.weekDay !== undefined && !chore.days && chore.weekDay === targetDay) return true;
    } else if (chore.frequency === 'bi-weekly' && chore.days && chore.days.includes(targetDay) && chore.startDate) {
      const start = new Date(chore.startDate + 'T00:00:00');
      start.setHours(0, 0, 0, 0);
      const startSun = new Date(start);
      startSun.setDate(startSun.getDate() - startSun.getDay());
      const targetSun = new Date(today);
      targetSun.setDate(targetSun.getDate() - targetSun.getDay());
      const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
      const weeksDiff = Math.floor(daysDiff / 7);
      return weeksDiff % 2 === 0;
    }
    return false;
  };

  const handleToggleChore = async (chore, kidId, isCompleted, completionId) => {
    try {
      const pointDiff = isCompleted ? -chore.points : chore.points;
      const batch = writeBatch(db);

      if (isCompleted) {
        // Uncheck: target and delete the exact completion document
        batch.delete(doc(db, 'completions', completionId));
      } else {
        // Check: create a surgical completion record
        const newCompRef = doc(collection(db, 'completions'));
        batch.set(newCompRef, {
          choreId: chore.id,
          completedBy: kidId,
          points: chore.points,
          timestamp: Timestamp.fromDate(new Date())
        });
      }

      // Atomically update kid points safely
      batch.update(doc(db, 'familyMembers', kidId), { points: increment(pointDiff) });
      await batch.commit();

      if (!isCompleted) {
         // Evaluate if they just finished their final active chore for the day
         const kidChores = chores.filter(c => isApplicableToday(c, kidId));
         const isAllDone = kidChores.every(c => 
           c.id === chore.id || completions.some(comp => comp.choreId === c.id && comp.completedBy === kidId)
         );
         if (isAllDone && kidChores.length > 0) {
           triggerMegaConfetti();
         }
      }
    } catch (error) {
      console.error("Error updating chore:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-full animate-pulse min-h-[250px]">
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3"><div className="h-12 bg-slate-100 rounded-xl"></div></div>
      </div>
    );
  }

  // Pre-calculate the filtered dashboard data
  const participatingKids = members.filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true');
  const kidsWithChores = participatingKids.map(kid => {
    const isHere = participatesInChoresHereOnDate(kid, new Date());
    if (!isHere) return { ...kid, activeChores: [] };
    
    const activeChores = chores.filter(c => isApplicableToday(c, kid.id));
    return { ...kid, activeChores };
  }).filter(kid => kid.activeChores.length > 0);

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
                {kid.activeChores.map(chore => {
                  const completion = completions.find(c => c.choreId === chore.id && c.completedBy === kid.id);
                  const isCompleted = !!completion;

                  return (
                    <div 
                      key={chore.id} 
                      onClick={() => handleToggleChore(chore, kid.id, isCompleted, completion?.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white hover:border-indigo-300 hover:shadow-sm'
                      }`}
                      style={{ borderColor: !isCompleted ? `${kid.color}40` : '' }}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                        )}
                        <span className={`font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {chore.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {chore.points}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}