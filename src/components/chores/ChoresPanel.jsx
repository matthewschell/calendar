import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useDailyCompletions } from '../../hooks/useDailyCompletions';
import { useCelebration } from '../../hooks/useCelebration';

export default function ChoresPanel() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { completions, loading: compsLoading, toggleCompletion } = useDailyCompletions();
  
  // Bring in the new Celebration Engine
  const { triggerCelebration } = useCelebration();
  
  const [claimingChore, setClaimingChore] = useState(null);

  if (choresLoading || membersLoading || compsLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 flex items-center justify-center min-h-0">
        <span className="text-slate-400 font-medium animate-pulse">Loading today's chores...</span>
      </div>
    );
  }

  const kids = members.filter(m => m.isKid);
  const assignedChores = chores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
  const bonusChores = chores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');

  const handleChoreClick = (chore) => {
    const isDone = completions[chore.id];

    if (!isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      setClaimingChore(chore);
      return;
    }

    if (isDone && chore.assignedTo === 'unassigned') {
      alert("Bonus chores cannot currently be unchecked. Admin feature coming soon.");
      return;
    }

    // Trigger atomic database update
    toggleCompletion(chore, chore.assignedTo, isDone);

    // If we are CHECKING a chore (it was not done)...
    if (!isDone && chore.assignedTo) {
      const kidChores = assignedChores.filter(c => c.assignedTo === chore.assignedTo);
      // Check if every other chore for this kid is already in the 'completions' state
      const allDone = kidChores.every(c => c.id === chore.id ? true : completions[c.id]);
      
      if (allDone && kidChores.length > 0) {
        // Trigger the dynamic Mega Blast from the Admin settings!
        triggerCelebration();
      }
    }
  };

  const handleClaimBonus = (kidId) => {
    toggleCompletion(claimingChore, kidId, false);
    
    // Pass in an override for a smaller "Bonus" pop using the engine!
    triggerCelebration({ style: 'stars', intensity: 50, duration: 2 });
    
    setClaimingChore(null);
  };

  const renderChore = (chore) => {
    const isDone = completions[chore.id];
    
    return (
      <div 
        key={chore.id}
        onClick={() => handleChoreClick(chore)}
        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
          isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <div>
            <div className={`font-semibold text-sm transition-colors ${isDone ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
              {chore.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {chore.assignedTo === 'unassigned' ? '⭐ Bonus' : members.find(m => m.id === chore.assignedTo)?.name}
            </div>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
          {chore.points}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📋</span> Today's Chores
      </h2>
      
      <div className="flex flex-col gap-5">
        {kids.map(kid => {
          const kidChores = assignedChores.filter(c => c.assignedTo === kid.id);
          if (kidChores.length === 0) return null;
          
          return (
            <div key={kid.id}>
              <h3 
                className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1"
                style={{ color: kid.color, borderColor: `${kid.color}33` }}
              >
                {kid.name}'s Chores
              </h3>
              <div className="flex flex-col gap-2">
                {kidChores.map(renderChore)}
              </div>
            </div>
          );
        })}

        {bonusChores.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1 text-amber-500 border-amber-200">
              ⭐ Bonus Chores
            </h3>
            <div className="flex flex-col gap-2">
              {bonusChores.map(renderChore)}
            </div>
          </div>
        )}
      </div>

      {/* Mini "Who did this?" Modal for Bonus Chores */}
      {claimingChore && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Who did this?</h3>
          <p className="text-sm text-slate-500 mb-4 font-medium">{claimingChore.name}</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-62.5">
            {kids.map(kid => (
              <button
                key={kid.id}
                onClick={() => handleClaimBonus(kid.id)}
                className="py-3 px-2 rounded-xl font-bold text-white shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: kid.color }}
              >
                {kid.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setClaimingChore(null)}
            className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}