import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function ChoresPanel() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  
  // Temporary local state for the checkmarks (we will wire this to Firestore next!)
  const [completions, setCompletions] = useState({});

  if (choresLoading || membersLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 flex items-center justify-center min-h-0">
        <span className="text-slate-400 font-medium animate-pulse">Loading today's chores...</span>
      </div>
    );
  }

  const toggleChore = (choreId) => {
    setCompletions(prev => ({
      ...prev,
      [choreId]: !prev[choreId]
    }));
  };

  const kids = members.filter(m => m.isKid);
  const assignedChores = chores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
  const bonusChores = chores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');

  // Reusable mini-component for rendering a single chore card
  const renderChore = (chore) => {
    const isDone = completions[chore.id];
    
    return (
      <div 
        key={chore.id}
        onClick={() => toggleChore(chore.id)}
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 overflow-y-auto min-h-0">
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

        {assignedChores.length === 0 && bonusChores.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-4">No chores assigned today!</p>
        )}
      </div>
    </div>
  );
}