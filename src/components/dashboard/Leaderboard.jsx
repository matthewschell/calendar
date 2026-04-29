// src/components/dashboard/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { Trophy, Medal, AlertCircle } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function Leaderboard() {
  const { members, loading: membersLoading } = useFamilyMembers();
  const [dailyScores, setDailyScores] = useState({});
  const [scoresLoading, setScoresLoading] = useState(true);

  // Fetch and calculate TODAY'S points directly from the completions collection
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const q = query(collection(db, 'completions'), where('date', '==', todayStr));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scores = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const kidId = data.completedBy;
        const points = Number(data.points) || 0;
        
        if (kidId) {
          scores[kidId] = (scores[kidId] || 0) + points;
        }
      });
      setDailyScores(scores);
      setScoresLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (membersLoading || scoresLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg animate-pulse min-h-62.5 shrink-0">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Map the dynamic daily points to the kids and sort them
  const kids = members
    .filter(m => m.isKid === true || String(m.isKid).toLowerCase() === 'true')
    .map(kid => ({
      ...kid,
      todayPoints: dailyScores[kid.id] || 0
    }))
    .sort((a, b) => b.todayPoints - a.todayPoints);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col min-h-62.5 shrink-0">
      
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10 shrink-0">
        <Trophy className="text-amber-500 w-6 h-6" /> Live Daily Leaderboard
      </h2>
      
      <div className="flex flex-col gap-3 relative z-10 flex-1">
        {kids.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-600">No kids found!</span>
          </div>
        ) : (
          kids.map((kid, index) => {
            let MedalIcon = null;
            let medalColor = '';
            
            // Only award medals if they actually have points today
            if (kid.todayPoints > 0) {
              if (index === 0) { MedalIcon = Medal; medalColor = 'text-yellow-500'; }
              else if (index === 1) { MedalIcon = Medal; medalColor = 'text-slate-400'; }
              else if (index === 2) { MedalIcon = Medal; medalColor = 'text-amber-700'; }
            }

            const displayName = kid.name || 'Unknown';
            const displayColor = kid.color || '#cbd5e1';

            return (
              <div 
                key={kid.id || index}
                className="flex items-center justify-between p-3 rounded-xl border-2 transition-transform hover:scale-105 bg-white shadow-sm"
                style={{ borderColor: `${displayColor}40` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-offset-1 shrink-0"
                    style={{ backgroundColor: displayColor, '--tw-ring-color': displayColor }}
                  >
                    {kid.avatar ? (
                      <img src={kid.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-bold text-slate-700 truncate">{displayName}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shrink-0">
                  <span className="text-lg font-black text-slate-800">{kid.todayPoints}</span>
                  {MedalIcon && <MedalIcon className={`w-5 h-5 drop-shadow-sm ${medalColor}`} />}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono text-center relative z-10 shrink-0">
        DEBUG: {members.length} members | {kids.length} kids | Daily Scope
      </div>
    </div>
  );
}