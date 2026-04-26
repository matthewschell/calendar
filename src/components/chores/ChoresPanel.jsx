import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useDailyCompletions } from '../../hooks/useDailyCompletions';
import { useCelebration } from '../../hooks/useCelebration';

export default function ChoresPanel() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { completions, loading: compsLoading, toggleCompletion } = useDailyCompletions();
  
  const { triggerCelebration } = useCelebration();
  
  const [claimingChore, setClaimingChore] = useState(null);
  const [celebratingKid, setCelebratingKid] = useState(null);

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
        // 1. Fire the custom Celebration Engine
        triggerCelebration();
        
        // 2. Find the kid and trigger the Mission Complete Modal!
        const member = members.find(m => m.id === chore.assignedTo);
        if (member) {
          setCelebratingKid(member);
          
          // Auto-dismiss after 15 seconds just in case they walk away
          setTimeout(() => setCelebratingKid(null), 15000);
        }
      }
    }
  };

  const handleClaimBonus = (kidId) => {
    toggleCompletion(claimingChore, kidId, false);
    // Small pop for claiming a bonus
    triggerCelebration({ 
      layers: [{ type: 'fireworks', colors: ['#FFD700', '#FFA500'], scale: 1, intensity: 0.5 }],
      duration: 2,
      soundUrl: '' 
    });
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
          {/* Bulletproof chore points display */}
          {Number(chore.points) || 0}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
        <span>📋</span> Today's Chores
      </h2>
      
      <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-4">
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

      {/* THE NEW MISSION COMPLETE MODAL (Teleported via Portal) */}
      {celebratingKid && createPortal(
        <div
          onClick={() => setCelebratingKid(null)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center flex-col gap-6 p-8 cursor-pointer transition-opacity"
          style={{ zIndex: 100001 }}
        >
          <div className="text-center animate-bounce-in">
            {/* Glowing Avatar */}
            <div 
              className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl transition-transform hover:scale-110"
              style={{ 
                backgroundColor: celebratingKid.color || '#cbd5e1', 
                boxShadow: `0 0 40px ${celebratingKid.color || '#cbd5e1'}` 
              }}
            >
              {celebratingKid.avatar ? (
                <img src={celebratingKid.avatar} className="w-full h-full object-cover" alt={celebratingKid.name} />
              ) : (
                <span className="text-5xl text-white font-bold">{celebratingKid.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            
            {/* Mission Complete Text */}
            <div className="text-2xl font-black text-amber-400 uppercase tracking-widest mb-2 drop-shadow-md">
              Mission Complete!
            </div>
            
            {/* Kid's Name with Glow */}
            <div 
              className="text-5xl font-black text-white mb-2 tracking-tight"
              style={{ textShadow: `0 0 30px ${celebratingKid.color || '#cbd5e1'}` }}
            >
              {celebratingKid.name}
            </div>
            
            <div className="text-xl text-emerald-200 mb-8 font-medium">
              All chores done for today! 🎉
            </div>
            
            {/* Points Pill (BULLETPROOFED) */}
            <div 
              className="inline-block text-white px-8 py-3 rounded-full text-2xl font-black shadow-xl border-2 border-white/20"
              style={{ 
                backgroundColor: celebratingKid.color || '#64748b', 
                boxShadow: `0 0 20px ${celebratingKid.color}88` 
              }}
            >
              {Number(celebratingKid.points) || 0} ⭐ Total
            </div>
            
            <div className="mt-8 text-sm text-slate-300 font-medium opacity-70 tracking-widest uppercase">
              tap anywhere to dismiss
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}