// src/components/dashboard/Leaderboard.jsx
import { useState, useEffect } from 'react';
import { Trophy, Medal, AlertCircle, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function Leaderboard() {
  const { members, loading: membersLoading } = useFamilyMembers();
  const [scores, setScores] = useState({});
  const [scoresLoading, setScoresLoading] = useState(true);
  
  // Real-time Database Config State
  const [widgetConfig, setWidgetConfig] = useState({
    enabledTimeframes: ['daily', 'weekly', 'lifetime'],
    defaultTimeframe: 'daily',
    autoRevertSeconds: 60
  });
  
  const [timeframe, setTimeframe] = useState('daily');
  const [revertCountdown, setRevertCountdown] = useState(null);

  // 1. Listen for Live Admin Settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'leaderboard'), (docSnap) => {
      if (docSnap.exists()) {
        const newConfig = docSnap.data();
        setWidgetConfig(newConfig);
        
        // If our current view was disabled by an admin, force jump to the new default
        if (!newConfig.enabledTimeframes.includes(timeframe)) {
          setTimeframe(newConfig.defaultTimeframe || 'daily');
        }
      }
    });
    return () => unsub();
  }, [timeframe]);

  // 2. Auto-Revert Logic
  useEffect(() => {
    if (timeframe !== widgetConfig.defaultTimeframe) {
      setRevertCountdown(widgetConfig.autoRevertSeconds);
      
      const interval = setInterval(() => {
        setRevertCountdown((prev) => {
          if (prev <= 1) {
            setTimeframe(widgetConfig.defaultTimeframe);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setRevertCountdown(null);
    }
  }, [timeframe, widgetConfig.defaultTimeframe, widgetConfig.autoRevertSeconds]);

  // 3. Data Fetching Logic (Same as before)
  useEffect(() => {
    if (timeframe === 'lifetime') {
      setScoresLoading(false);
      return;
    }

    setScoresLoading(true);
    const now = new Date();
    let startDate = new Date();
    
    if (timeframe === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const q = query(collection(db, 'completions'), where('timestamp', '>=', startDate));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const calculatedScores = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const kidId = data.completedBy;
        const points = Number(data.points) || 0;
        if (kidId) calculatedScores[kidId] = (calculatedScores[kidId] || 0) + points;
      });
      setScores(calculatedScores);
      setScoresLoading(false);
    });

    return () => unsubscribe();
  }, [timeframe]);

  if (membersLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg animate-pulse min-h-[400px] shrink-0">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
          <div className="h-14 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const kids = members
    .filter(m => m.isKid === true || String(m.isKid).toLowerCase() === 'true')
    .map(kid => ({
      ...kid,
      displayPoints: timeframe === 'lifetime' ? (Number(kid.points) || 0) : (scores[kid.id] || 0)
    }))
    .sort((a, b) => b.displayPoints - a.displayPoints);

  const isDefaultView = timeframe === widgetConfig.defaultTimeframe;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col min-h-[400px] shrink-0 transition-all duration-500">
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${isDefaultView ? 'bg-amber-400/20' : 'bg-slate-300/20'}`}></div>
      
      <div className={`flex flex-col mb-4 relative z-10 shrink-0 transition-all duration-300 ${isDefaultView ? 'items-center text-center' : 'items-start'}`}>
        <h2 className={`font-bold flex items-center gap-2 transition-all duration-300 ${isDefaultView ? 'text-2xl text-amber-600' : 'text-lg text-slate-600'}`}>
          <Trophy className={`${isDefaultView ? 'text-amber-500 w-7 h-7' : 'text-slate-400 w-5 h-5'}`} /> 
          {isDefaultView ? `Live ${timeframe} Leaderboard` : `${timeframe} Leaderboard`}
        </h2>
        
        {!isDefaultView && revertCountdown !== null && (
          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
            <Clock className="w-3 h-3" /> Reverting to {widgetConfig.defaultTimeframe} in {revertCountdown}s
          </div>
        )}
      </div>

      {widgetConfig.enabledTimeframes.length > 1 && (
        <div className="flex p-1 bg-slate-100 rounded-xl mb-4 relative z-10 shrink-0 border border-slate-200 shadow-inner">
          {widgetConfig.enabledTimeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`flex-1 text-xs font-bold py-2 px-1 rounded-lg capitalize transition-all duration-200 ${
                timeframe === t 
                  ? 'bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-3 relative z-10 flex-1">
        {scoresLoading ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : kids.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-600">No kids found!</span>
          </div>
        ) : (
          kids.map((kid, index) => {
            let MedalIcon = null;
            let medalColor = '';
            
            if (kid.displayPoints > 0) {
              if (index === 0) { MedalIcon = Medal; medalColor = 'text-yellow-500'; }
              else if (index === 1) { MedalIcon = Medal; medalColor = 'text-slate-400'; }
              else if (index === 2) { MedalIcon = Medal; medalColor = 'text-amber-700'; }
            }

            const displayName = kid.name || 'Unknown';
            const displayColor = kid.color || '#cbd5e1';

            return (
              <div 
                key={kid.id || index}
                className={`flex items-center justify-between rounded-xl border-2 transition-all duration-300 hover:scale-105 bg-white shadow-sm ${isDefaultView ? 'p-3.5' : 'p-2 opacity-90'}`}
                style={{ borderColor: `${displayColor}40` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-offset-1 shrink-0 transition-all ${isDefaultView ? 'w-11 h-11 text-base' : 'w-8 h-8 text-sm'}`}
                    style={{ backgroundColor: displayColor, '--tw-ring-color': displayColor }}
                  >
                    {kid.avatar ? (
                      <img src={kid.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={`font-bold text-slate-700 truncate ${isDefaultView ? 'text-base' : 'text-sm'}`}>
                    {displayName}
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shrink-0 transition-all ${isDefaultView ? 'scale-100' : 'scale-90'}`}>
                  <span className={`font-black text-slate-800 ${isDefaultView ? 'text-xl' : 'text-lg'}`}>
                    {kid.displayPoints}
                  </span>
                  {MedalIcon && <MedalIcon className={`drop-shadow-sm ${medalColor} ${isDefaultView ? 'w-6 h-6' : 'w-4 h-4'}`} />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}