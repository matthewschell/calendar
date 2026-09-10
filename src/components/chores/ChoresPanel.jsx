import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useDailyCompletions } from '../../hooks/useDailyCompletions';
import { useCelebration } from '../../hooks/useCelebration';
import { useCustody } from '../../hooks/useCustody';
import { useKiosk } from '../../hooks/useKiosk';
import { useAdminPin } from '../../hooks/useAdminPin';
import { playAudio, preloadMedia } from '../../utils/audioPlayer';

export default function ChoresPanel() {
  const adminPin = useAdminPin();
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { completions, loading: compsLoading, toggleCompletion } = useDailyCompletions();
  
  const { settings: globalCeleb, triggerCelebration } = useCelebration();
  const { isHereToday } = useCustody();
  const { isMuted } = useKiosk();
  
  const [claimingChore, setClaimingChore] = useState(null);
  const [celebratingKid, setCelebratingKid] = useState(null);
  const [quickAddState, setQuickAddState] = useState('hidden'); 
  const [pinInput, setPinInput] = useState('');
  const [quickAddForm, setQuickAddForm] = useState({ name: '', points: 10, assignedTo: 'unassigned' });

  // Intelligent Background Caching
  // Only downloads files that are actively assigned to kids or the global celebration
  useEffect(() => {
    // 1. Cache Global Celebration
    if (globalCeleb?.type === 'video' && globalCeleb?.videoUrl) preloadMedia(globalCeleb.videoUrl);
    if (globalCeleb?.type === 'particles' && globalCeleb?.soundUrl) preloadMedia(globalCeleb.soundUrl);

    // 2. Cache Kid Specific Sounds & Celebrations
    members.forEach(m => {
      if (m.signatureSound) preloadMedia(m.signatureSound);
      if (m.customCelebration?.enabled) {
        if (m.customCelebration.type === 'video' && m.customCelebration.videoUrl) preloadMedia(m.customCelebration.videoUrl);
        if (m.customCelebration.type === 'particles' && m.customCelebration.soundUrl) preloadMedia(m.customCelebration.soundUrl);
      }
    });
  }, [members, globalCeleb]);

  if (choresLoading || membersLoading || compsLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 flex items-center justify-center shrink-0 min-h-[200px]">
        <span className="text-slate-400 font-medium animate-pulse">Loading today's chores...</span>
      </div>
    );
  }

  const isChoreScheduledForToday = (chore, today = new Date()) => {
    if (chore.isArchived) return false;
    const targetDay = today.getDay();
    const freq = chore.frequency || 'daily';

    if (freq === 'today-only') return chore.createdDate === today.toDateString();
    if (freq === 'daily') return true;
    if (freq === 'weekly') {
      if (chore.days && chore.days.length > 0) return chore.days.includes(targetDay);
      if (chore.weekDay !== null && chore.weekDay !== undefined) return chore.weekDay === targetDay;
      return false;
    }
    if (freq === 'bi-weekly' && chore.days && chore.days.length > 0 && chore.startDate) {
      if (!chore.days.includes(targetDay)) return false;
      const start = new Date(chore.startDate + 'T00:00:00');
      start.setHours(0, 0, 0, 0);
      const startSun = new Date(start);
      startSun.setDate(startSun.getDate() - startSun.getDay());
      const targetSun = new Date(today);
      targetSun.setHours(0, 0, 0, 0);
      targetSun.setDate(targetSun.getDate() - targetSun.getDay());
      const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
      return Math.floor(daysDiff / 7) % 2 === 0;
    }
    return true;
  };

  const kids = members.filter(m => m.participatesInChores && isHereToday(m));
  const todayActiveChores = chores.filter(c => isChoreScheduledForToday(c));
  const assignedChores = todayActiveChores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
  const bonusChores = todayActiveChores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');

  const handleChoreClick = (chore) => {
    const isDone = Boolean(completions[chore.id]);
    if (!isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      setClaimingChore(chore);
      return;
    }
    if (isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      const claimerId = completions[`${chore.id}_claimer`];
      if (claimerId) toggleCompletion(chore, claimerId, true);
      return;
    }
    toggleCompletion(chore, chore.assignedTo, isDone);

    if (!isDone && chore.assignedTo) {
      const member = members.find(m => m.id === chore.assignedTo);
      
      if (!isMuted && member?.signatureSound) {
        playAudio(member.signatureSound);
      }
      
      const kidChores = assignedChores.filter(c => c.assignedTo === chore.assignedTo);
      const allDone = kidChores.every(c => c.id === chore.id ? true : completions[c.id]);
      
      if (allDone && kidChores.length > 0) {
        const celebConfig = member?.customCelebration?.enabled ? member.customCelebration : null;
        triggerCelebration(celebConfig);
        
        if (member) {
          setCelebratingKid({ ...member, points: Number(member.points || 0) + Number(chore.points || 0) });
          setTimeout(() => setCelebratingKid(null), 15000);
        }
      }
    }
  };

  const handleClaimBonus = (kidId) => {
    toggleCompletion(claimingChore, kidId, false);
    triggerCelebration({ layers: [{ type: 'fireworks', colors: ['#FFD700', '#FFA500'], scale: 1, intensity: 0.5 }], duration: 2, soundUrl: '' });
    setClaimingChore(null);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setQuickAddState('form');
      setPinInput('');
    } else {
      alert('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleSaveQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddForm.name) return;
    try {
      const choreId = Date.now().toString();
      await setDoc(doc(db, 'chores', choreId), {
        name: quickAddForm.name,
        points: Number(quickAddForm.points),
        assignedTo: quickAddForm.assignedTo,
        frequency: 'today-only',
        createdDate: new Date().toDateString(),
        todayOnly: true
      });
      setQuickAddState('hidden');
      setQuickAddForm({ name: '', points: 10, assignedTo: 'unassigned' });
    } catch (error) {
      alert("Failed to add chore.");
    }
  };

  const renderChore = (chore) => {
    const isDone = Boolean(completions[chore.id]);
    const claimerId = completions[`${chore.id}_claimer`];
    const claimer = claimerId ? members.find(m => m.id === claimerId) : null;
    return (
      <div key={chore.id} onClick={() => handleChoreClick(chore)} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'}`}>
        <div className="flex items-center gap-3">
          {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}
          <div>
            <div className={`font-semibold text-sm transition-colors flex items-center gap-2 ${isDone ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
              {chore.name}
              {chore.frequency === 'today-only' && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase tracking-wider no-underline">Today Only</span>}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {chore.assignedTo === 'unassigned' || !chore.assignedTo ? (isDone && claimer ? `Claimed by ${claimer.name}` : '⭐ Bonus (Anyone)') : members.find(m => m.id === chore.assignedTo)?.name}
            </div>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">{Number(chore.points) || 0}</div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><span>📋</span> Today's Chores</h2>
        <button onClick={() => setQuickAddState('pin')} className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer" title="Quick Add Chore (Admin)"><Plus className="w-5 h-5" /></button>
      </div>
      
      <div className="flex flex-col gap-5">
        {kids.map(kid => {
          const kidChores = assignedChores.filter(c => c.assignedTo === kid.id);
          if (kidChores.length === 0) return null;
          return (
            <div key={kid.id}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: kid.color, borderColor: `${kid.color}33` }}>{kid.name}'s Chores</h3>
              <div className="flex flex-col gap-2">{kidChores.map(renderChore)}</div>
            </div>
          );
        })}
        {bonusChores.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1 text-amber-500 border-amber-200">⭐ Bonus Chores</h3>
            <div className="flex flex-col gap-2">{bonusChores.map(renderChore)}</div>
          </div>
        )}
        {todayActiveChores.length === 0 && <div className="text-center text-slate-400 py-8 font-medium">No chores scheduled for today! 🎉</div>}
      </div>

      {claimingChore && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Who did this?</h3>
          <p className="text-sm text-slate-500 mb-4 font-medium">{claimingChore.name}</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-[250px]">
            {kids.map(kid => (
              <button key={kid.id} onClick={() => handleClaimBonus(kid.id)} className="py-3 px-2 rounded-xl font-bold text-white shadow-sm transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: kid.color }}>{kid.name}</button>
            ))}
          </div>
          <button onClick={() => setClaimingChore(null)} className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
        </div>
      )}

      {quickAddState !== 'hidden' && createPortal(
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[1100] flex items-center justify-center p-4 transition-opacity" onClick={() => setQuickAddState('hidden')}>
          {quickAddState === 'pin' && (
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin PIN</h3>
              <p className="text-slate-500 mb-6 text-sm">Required to add a chore</p>
              <form onSubmit={handlePinSubmit}>
                <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} maxLength={8} autoFocus className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="••••" />
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
              </form>
            </div>
          )}

          {quickAddState === 'form' && (
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" /> Quick Add Chore
                </h3>
                <button onClick={() => setQuickAddState('hidden')} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveQuickAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                  <input required type="text" value={quickAddForm.name} onChange={e => setQuickAddForm({...quickAddForm, name: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" placeholder="e.g. Rake Leaves" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points</label>
                    <input required type="number" min="0" value={quickAddForm.points} onChange={e => setQuickAddForm({...quickAddForm, points: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                    <select value={quickAddForm.assignedTo} onChange={e => setQuickAddForm({...quickAddForm, assignedTo: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer">
                      <option value="unassigned">⭐ Bonus / Anyone</option>
                      {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    Frequency
                    <span className="text-[10px] text-indigo-500">Changes open Builder</span>
                  </label>
                  <select 
                    value="today-only"
                    onChange={(e) => {
                      const newFreq = e.target.value;
                      if (newFreq !== 'today-only') {
                         sessionStorage.setItem('adminBypass', 'true');
                         sessionStorage.setItem('draftChore', JSON.stringify({ ...quickAddForm, frequency: newFreq }));
                         window.dispatchEvent(new Event('openAdminToChores'));
                         setQuickAddState('hidden');
                         setQuickAddForm({ name: '', points: 10, assignedTo: 'unassigned' });
                      }
                    }}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl bg-indigo-50 text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="today-only">📅 Today Only</option>
                    <option value="daily">🔄 Daily</option>
                    <option value="weekly">📅 Weekly</option>
                    <option value="bi-weekly">🗓️ Bi-Weekly</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md mt-2 cursor-pointer">
                  Add to Today's List
                </button>
              </form>
            </div>
          )}

        </div>,
        document.body
      )}

      {celebratingKid && createPortal(
        <div onClick={() => setCelebratingKid(null)} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center flex-col gap-6 p-8 cursor-pointer transition-opacity" style={{ zIndex: 100001 }}>
          <div className="text-center animate-bounce-in">
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: celebratingKid.color || '#cbd5e1', boxShadow: `0 0 40px ${celebratingKid.color || '#cbd5e1'}` }}>
              {celebratingKid.avatar ? <img src={celebratingKid.avatar} className="w-full h-full object-cover" alt={celebratingKid.name} /> : <span className="text-5xl text-white font-bold">{celebratingKid.name.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="text-2xl font-black text-amber-400 uppercase tracking-widest mb-2 drop-shadow-md">Mission Complete!</div>
            <div className="text-5xl font-black text-white mb-2 tracking-tight" style={{ textShadow: `0 0 30px ${celebratingKid.color || '#cbd5e1'}` }}>{celebratingKid.name}</div>
            <div className="text-xl text-emerald-200 mb-8 font-medium">All chores done for today! 🎉</div>
            <div className="inline-block text-white px-8 py-3 rounded-full text-2xl font-black shadow-xl border-2 border-white/20" style={{ backgroundColor: celebratingKid.color || '#64748b', boxShadow: `0 0 20px ${celebratingKid.color}88` }}>{celebratingKid.points || 0} ⭐ Total</div>
            <div className="mt-8 text-sm text-slate-300 font-medium opacity-70 tracking-widest uppercase">tap anywhere to dismiss</div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}