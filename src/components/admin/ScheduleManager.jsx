import { useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, AlertCircle, RefreshCcw, Check, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCustody } from '../../hooks/useCustody';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function ScheduleManager() {
  const { isHereToday, overrides, toggleOverride, clearOverride } = useCustody();
  const { members, loading } = useFamilyMembers();
  
  const [expandedKid, setExpandedKid] = useState(null);
  
  // Draft states for the Pattern Builder
  const [draftAnchor, setDraftAnchor] = useState('');
  const [draftCycle, setDraftCycle] = useState(14);
  const [draftPattern, setDraftPattern] = useState([]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading schedules...</div>;

  const kids = members.filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true');

  const openKidSettings = (kid) => {
    if (expandedKid === kid.id) {
      setExpandedKid(null);
      return;
    }
    
    setExpandedKid(kid.id);
    
    // Initialize draft state with their current schedule, or default to a blank 14-day cycle
    const today = new Date();
    const isoToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setDraftAnchor(kid.schedule?.referenceDate || isoToday);
    
    const existingPattern = kid.schedule?.pattern;
    if (existingPattern && existingPattern.length > 0) {
      setDraftCycle(existingPattern.length);
      setDraftPattern(existingPattern);
    } else {
      setDraftCycle(14);
      setDraftPattern(Array(14).fill(true));
    }
  };

  const handleCycleChange = (newLength) => {
    setDraftCycle(newLength);
    // Expand or shrink the array while preserving existing choices where possible
    setDraftPattern(prev => {
      const newArray = Array(Number(newLength)).fill(true);
      for (let i = 0; i < Math.min(prev.length, newLength); i++) {
        newArray[i] = prev[i];
      }
      return newArray;
    });
  };

  const togglePatternDay = (index) => {
    setDraftPattern(prev => {
      const newPattern = [...prev];
      newPattern[index] = !newPattern[index];
      return newPattern;
    });
  };

  const handleSaveSchedule = async (kidId) => {
    try {
      await updateDoc(doc(db, 'familyMembers', kidId), { 
        schedule: {
          referenceDate: draftAnchor,
          pattern: draftPattern
        } 
      });
      setExpandedKid(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  // Helper to generate the day names for the Pattern Builder UI
  const getDayLabel = (anchorString, offsetDays) => {
    if (!anchorString) return 'Day';
    const [y, m, d] = anchorString.split('-');
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
      <div className="bg-slate-50 border-b-2 border-slate-200 p-4 flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-indigo-600" />
        <h3 className="font-bold text-lg text-slate-800">Custody & Schedules</h3>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-start gap-2 bg-indigo-50 text-indigo-700 p-3 rounded-xl border border-indigo-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-medium">
            Overrides are strictly for <b>today</b> and will automatically clear at midnight. The infinite schedule builder determines the baseline flow.
          </p>
        </div>

        {kids.map(kid => {
          const hereToday = isHereToday(kid);
          const hasOverride = overrides[kid.id] !== undefined;
          const displayColor = kid.color || '#6366f1';
          const isExpanded = expandedKid === kid.id;

          return (
            <div key={kid.id} className="border-2 rounded-xl overflow-hidden transition-colors" style={{ borderColor: `${displayColor}33` }}>
              
              {/* Main Status Row */}
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: hereToday ? `${displayColor}11` : '#fee2e2' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                    style={{ backgroundColor: displayColor }}
                  >
                    {kid.avatar ? <img src={kid.avatar} alt={kid.name} className="w-full h-full rounded-full object-cover" /> : kid.name[0]}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate flex items-center gap-2">
                      {kid.name}
                      {hasOverride && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                          OVERRIDDEN
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold ${hereToday ? 'text-emerald-600' : 'text-red-500'}`}>
                      {hereToday ? '✅ Scheduled: Here' : '❌ Scheduled: Away'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasOverride ? (
                    <button 
                      onClick={() => clearOverride(kid.id)}
                      className="flex items-center gap-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  ) : (
                    <button 
                      onClick={() => toggleOverride(kid.id, hereToday)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm text-white ${hereToday ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    >
                      {hereToday ? 'Set Away' : 'Set Here'}
                    </button>
                  )}
                </div>
              </div>

              {/* Base Schedule Settings Accordion */}
              <button 
                onClick={() => openKidSettings(kid)}
                className="w-full flex items-center justify-center gap-1 py-2 bg-white border-t border-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Close Builder' : 'Open Pattern Builder'}
              </button>

              {isExpanded && (
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">1. Pick an Anchor Date</label>
                      <input 
                        type="date" 
                        value={draftAnchor}
                        onChange={(e) => setDraftAnchor(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">2. Cycle Length</label>
                      <select 
                        value={draftCycle}
                        onChange={(e) => handleCycleChange(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value={7}>7 Days (1 Week)</option>
                        <option value={14}>14 Days (2 Weeks)</option>
                        <option value={21}>21 Days (3 Weeks)</option>
                        <option value={28}>28 Days (4 Weeks)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center justify-between">
                      <span>3. Build the Repeating Pattern</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full normal-case">
                        Starts on {draftAnchor ? getDayLabel(draftAnchor, 0) : 'selected date'}
                      </span>
                    </label>
                    
                    <div className="grid grid-cols-7 gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                      {draftPattern.map((isHere, index) => {
                        const dayName = getDayLabel(draftAnchor, index);
                        return (
                          <button
                            key={index}
                            onClick={() => togglePatternDay(index)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                              isHere 
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase mb-1">{dayName}</span>
                            {isHere ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleSaveSchedule(kid.id)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                    >
                      Save Infinite Schedule
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}