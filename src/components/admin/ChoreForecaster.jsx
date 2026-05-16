// src/components/admin/ChoreForecaster.jsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Calculator, AlertTriangle, CheckCircle2, CalendarDays } from 'lucide-react';

export default function ChoreForecaster() {
  const [kids, setKids] = useState([]);
  const [chores, setChores] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Kids, Chores, and Future Custody Overrides
  useEffect(() => {
    const kidsQuery = query(collection(db, 'familyMembers'), where('participatesInChores', '==', true));
    const unsubKids = onSnapshot(kidsQuery, (snap) => {
      setKids(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.localeCompare(b.name)));
    });

    const unsubChores = onSnapshot(collection(db, 'chores'), (snap) => {
      setChores(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to all overrides so we can see future manual adjustments
    const unsubOverrides = onSnapshot(collection(db, 'dailyOverrides'), (snap) => {
      const ov = {};
      snap.docs.forEach(doc => {
        ov[doc.id] = doc.data(); // doc.id is formatted "YYYY-MM-DD"
      });
      setOverrides(ov);
      setLoading(false);
    });

    return () => {
      unsubKids();
      unsubChores();
      unsubOverrides();
    };
  }, []);

  const getLocalIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. Exact replication of your useCustody math
  const participatesInChoresHereOnDate = (kid, dateObj) => {
    const isoDate = getLocalIsoDate(dateObj);
    
    // Check manual override first
    if (overrides[isoDate] && overrides[isoDate][kid.id] !== undefined) {
      return overrides[isoDate][kid.id];
    }

    // Check base schedule pattern array
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

  // 3. Generate the next 14 days
  const getNext14Days = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        dateObj: d,
        dayName: dayNames[d.getDay()],
        dayString: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return days;
  };

  const forecastDays = getNext14Days();

  // 4. Mathematical Engine: Matches your chore frequency schemas
  const calculateDailyPoints = (kid, day) => {
    let totalPoints = 0;
    
    // If the kid is away, they are assigned 0 chores/points that day
    if (!participatesInChoresHereOnDate(kid, day.dateObj)) {
      return 0;
    }

    chores.forEach(chore => {
      if (chore.isArchived) return;
      if (chore.assignedTo !== kid.id) return;

      const targetDay = day.dateObj.getDay();

      if (chore.frequency === 'today-only') {
        if (chore.createdDate === day.dateObj.toDateString()) {
          totalPoints += Number(chore.points || 0);
        }
      } else if (chore.frequency === 'daily' || !chore.frequency) {
        totalPoints += Number(chore.points || 0);
      } else if (chore.frequency === 'weekly') {
        if (chore.days && chore.days.includes(targetDay)) {
          totalPoints += Number(chore.points || 0);
        } else if (chore.weekDay !== null && chore.weekDay !== undefined && !chore.days && chore.weekDay === targetDay) {
          totalPoints += Number(chore.points || 0); // Legacy fallback
        }
      } else if (chore.frequency === 'bi-weekly' && chore.days && chore.days.includes(targetDay) && chore.startDate) {
        const start = new Date(chore.startDate + 'T00:00:00');
        start.setHours(0, 0, 0, 0);
        const startSun = new Date(start); 
        startSun.setDate(startSun.getDate() - startSun.getDay());
        
        const targetSun = new Date(day.dateObj); 
        targetSun.setDate(targetSun.getDate() - targetSun.getDay());
        
        const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
        const weeksDiff = Math.floor(daysDiff / 7);
        if (weeksDiff % 2 === 0) {
          totalPoints += Number(chore.points || 0);
        }
      }
    });

    return totalPoints;
  };

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse font-medium">Booting mathematical forecaster...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">14-Day Forecaster Matrix</h3>
            <p className="text-xs text-slate-500">Cross-referencing custody schedules to ensure 100pt/day targets.</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Target (100)</span>
          <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-4 h-4"/> Under (&lt;100)</span>
          <span className="flex items-center gap-1 text-rose-500"><AlertTriangle className="w-4 h-4"/> Over (&gt;100)</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#e2e8f0]">Family Member</th>
              {forecastDays.map((day, idx) => (
                <th key={idx} className={`px-2 py-3 text-center min-w-[70px] ${idx === 0 ? 'bg-indigo-50 text-indigo-700' : ''}`}>
                  <div className="font-bold">{day.dayName}</div>
                  <div className="text-[10px] font-medium opacity-70">{day.dayString}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kids.map(kid => (
              <tr key={kid.id} className="hover:bg-slate-50 transition-colors">
                
                {/* Kid Name Column (Sticky) */}
                <td className="px-4 py-3 font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[1px_0_0_0_#e2e8f0] flex items-center gap-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-white shadow-inner overflow-hidden shrink-0" style={{ backgroundColor: kid.color || '#6366f1' }}>
                     {kid.avatar ? <img src={kid.avatar} className="w-full h-full object-cover" alt={kid.name} /> : kid.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[100px]">{kid.name}</span>
                </td>

                {/* Day Columns */}
                {forecastDays.map((day, idx) => {
                  const isHere = participatesInChoresHereOnDate(kid, day.dateObj);
                  const pts = calculateDailyPoints(kid, day);
                  
                  // Color Logic
                  let cellBg = 'bg-slate-50';
                  let textColor = 'text-slate-400';
                  let fontWeight = 'font-medium';
                  let content = pts;
                  
                  if (!isHere) {
                    cellBg = 'bg-slate-100/50 border border-slate-200/50';
                    textColor = 'text-slate-400';
                    fontWeight = 'font-bold text-[9px] uppercase tracking-wider';
                    content = 'Away';
                  } else if (pts === 100) {
                    cellBg = 'bg-emerald-100 border border-emerald-200';
                    textColor = 'text-emerald-700';
                    fontWeight = 'font-black';
                  } else if (pts > 0 && pts < 100) {
                    cellBg = 'bg-amber-50 border border-amber-200';
                    textColor = 'text-amber-600';
                    fontWeight = 'font-bold';
                  } else if (pts > 100) {
                    cellBg = 'bg-rose-50 border border-rose-200';
                    textColor = 'text-rose-600';
                    fontWeight = 'font-black';
                  } else if (pts === 0) {
                    cellBg = 'bg-slate-50 border border-slate-200';
                    textColor = 'text-slate-400';
                    fontWeight = 'font-bold';
                  }

                  return (
                    <td key={idx} className="p-1.5 text-center">
                      <div 
                        className={`w-full h-full py-2 rounded-lg flex items-center justify-center transition-all ${cellBg} ${textColor} ${fontWeight}`}
                        title={!isHere ? `${kid.name} is scheduled to be away` : `${pts} points assigned`}
                      >
                        {content}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {kids.length === 0 && (
          <div className="p-8 text-center text-slate-400 font-medium">
            No kids found in the roster. Add kids in the Family Members tab to view the forecast!
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-3 text-[11px] text-slate-500 border-t border-slate-100 flex items-center gap-2">
         <CalendarDays className="w-4 h-4 shrink-0" />
         This matrix reads directly from your custody override schedule and automatically calculates points to ensure everyone hits exactly 100 points on the days they are home.
      </div>
    </div>
  );
}