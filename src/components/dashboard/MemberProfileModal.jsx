// src/components/dashboard/MemberProfileModal.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Wallet, Star, Loader2, UserCircle, History, DollarSign, Volume2, ChevronLeft, ChevronRight, BarChart3, LineChart } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';

export default function MemberProfileModal({ member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Settings Data
  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [soundOptions, setSoundOptions] = useState([]);
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 });
  
  // History State
  const [historyData, setHistoryData] = useState([]);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  
  // Chart Controls
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [historyTimeframe, setHistoryTimeframe] = useState('weekly'); // 'weekly' or 'monthly'
  
  // The reference date used to calculate the start/end of the viewed range
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Fetch Admin Libraries & Config
  useEffect(() => {
    if (!isEditing) return;
    const fetchLibraries = async () => {
      const avatarSnap = await getDoc(doc(db, 'settings', 'avatars'));
      if (avatarSnap.exists() && avatarSnap.data().urls) setDefaultAvatars(avatarSnap.data().urls);

      const soundSnap = await getDoc(doc(db, 'settings', 'sounds'));
      if (soundSnap.exists() && soundSnap.data().items) setSoundOptions(soundSnap.data().items);
    };
    fetchLibraries();
  }, [isEditing]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => {
      if (docSnap.exists()) setAllowanceConfig(docSnap.data());
    });
    return () => unsub();
  }, []);

  // Fetch History for the Selected Range
  useEffect(() => {
    if (!member) return;

    // The actual "Today" and actual "Current Week" for top summary stats
    const actualToday = new Date();
    const actualStartOfWeek = new Date(actualToday);
    actualStartOfWeek.setDate(actualToday.getDate() - actualToday.getDay());
    actualStartOfWeek.setHours(0, 0, 0, 0);

    // Calculate the start and end of the currently viewed chart range
    let startOfRange = new Date(referenceDate);
    let endOfRange = new Date(referenceDate);

    if (historyTimeframe === 'weekly') {
      startOfRange.setDate(referenceDate.getDate() - referenceDate.getDay());
      endOfRange = new Date(startOfRange);
      endOfRange.setDate(startOfRange.getDate() + 6);
    } else {
      startOfRange = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      endOfRange = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
    }
    startOfRange.setHours(0, 0, 0, 0);
    endOfRange.setHours(23, 59, 59, 999);

    // Query bounds to capture both the summary week and the viewed chart week/month
    const minDate = startOfRange < actualStartOfWeek ? startOfRange : actualStartOfWeek;
    const maxDate = endOfRange > actualToday ? endOfRange : actualToday;
    maxDate.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'completions'), 
      where('completedBy', '==', member.id), 
      where('timestamp', '>=', minDate), 
      where('timestamp', '<=', maxDate)
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      let currentWeekPts = 0;
      const dailyMap = {};
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Initialize map for the selected timeframe
      const daysInRange = historyTimeframe === 'weekly' ? 7 : endOfRange.getDate();
      
      for (let i = 0; i < daysInRange; i++) {
        const d = new Date(startOfRange);
        d.setDate(startOfRange.getDate() + i);
        const isPayDay = d.getDay() === (allowanceConfig.payDay ?? 5);
        const dayLabel = historyTimeframe === 'weekly' ? dayNames[d.getDay()] : d.getDate().toString();
        
        dailyMap[d.toDateString()] = { dayLabel, pts: 0, isPayDay, dateObj: d };
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        if (!date) return;

        // Tally actual current week points (Sunday to Saturday of this week)
        if (date >= actualStartOfWeek && date <= actualToday) {
          currentWeekPts += (Number(data.points) || 0);
        }

        // Tally points for the chart if the completion falls within the viewed range
        if (date >= startOfRange && date <= endOfRange) {
          const dateString = date.toDateString();
          if (dailyMap[dateString]) {
            dailyMap[dateString].pts += (Number(data.points) || 0);
          }
        }
      });

      // Sort ensuring date order
      const chartArray = Object.values(dailyMap).sort((a, b) => a.dateObj - b.dateObj);

      setWeeklyPoints(currentWeekPts);
      setHistoryData(chartArray);
    });

    return () => unsub();
  }, [member, referenceDate, historyTimeframe, allowanceConfig.payDay]);

  if (!member) return null;

  const payRate = member.payRate || 0;
  const weeklyEarned = (weeklyPoints * payRate).toFixed(2);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${member.name}&background=cbd5e1&color=fff&size=128`;
  
  // We use the same max points for both charts now, adding a minimum ceiling of 10 so low days don't look huge
  const maxPoints = Math.max(...historyData.map(d => d.pts), 10);

  // Build SVG Polyline points for the daily point values
  const linePoints = historyData.map((d, i) => {
    const x = (i / (historyData.length - 1 || 1)) * 100;
    const y = 95 - ((d.pts / maxPoints) * 90); // Scale between 5% and 95% so the line doesn't clip the top/bottom
    return `${x},${y}`;
  }).join(' ');

  const handleUpdateSetting = async (field, value) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), { [field]: value });
      if (field === 'avatar') setIsEditing(false);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert("Failed to save changes.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileRef = ref(storage, `avatars/${member.id}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      await handleUpdateSetting('avatar', downloadUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const shiftTimeframe = (offset) => {
    setReferenceDate(prev => {
      const next = new Date(prev);
      if (historyTimeframe === 'weekly') {
        next.setDate(prev.getDate() + (offset * 7));
      } else {
        next.setMonth(prev.getMonth() + offset);
      }
      return next;
    });
  };

  // Generate the formatted label for the current viewed range
  let rangeLabel = '';
  if (historyTimeframe === 'weekly') {
    const wStart = new Date(referenceDate);
    wStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 6);
    rangeLabel = `${wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
  } else {
    rangeLabel = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Helper to determine if a label should be shown in monthly view to prevent crowding
  const shouldShowLabel = (index, total) => {
    if (historyTimeframe === 'weekly') return true;
    if (index === 0 || index === total - 1) return true; // Always show first and last
    return index % 5 === 0; // Show every 5th day
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-center relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-4 mb-3 group">
            <div 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center text-3xl font-black text-white"
              style={{ backgroundColor: member.color || '#cbd5e1' }}
            >
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight">{member.name}</h2>
        </div>

        {/* Content Section (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {isEditing ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* Sound Selection */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
                  <Volume2 className="w-4 h-4" /> Signature Sound
                </label>
                <select
                  value={member.signatureSound || ''}
                  onChange={(e) => handleUpdateSetting('signatureSound', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Default Pop</option>
                  {soundOptions.map((s, idx) => (
                    <option key={idx} value={s.url}>{s.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 pl-1">This plays when you complete a chore!</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                  <ImageIcon className="w-4 h-4" /> Choose an Avatar
                </label>
                
                {defaultAvatars.length === 0 ? (
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <UserCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No default avatars available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {defaultAvatars.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleUpdateSetting('avatar', url)}
                        className="aspect-square rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden focus:outline-none"
                      >
                        <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 uppercase font-bold tracking-wider">Or</span>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>

              <button 
                onClick={() => setIsEditing(false)}
                className="w-full py-3 bg-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors focus:outline-none"
              >
                Done Editing
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Weekly Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center justify-center text-center">
                  <Star className="w-6 h-6 text-amber-500 mb-2" />
                  <span className="text-3xl font-black text-amber-600 leading-none">{weeklyPoints}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-amber-600/70 uppercase tracking-wider mt-1">Points This Week</span>
                </div>
                
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center text-center">
                  <Wallet className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-3xl font-black text-emerald-600 leading-none">${weeklyEarned}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Earned This Week</span>
                </div>
              </div>

              {/* Advanced History Chart */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                
                {/* Chart Header & Controls */}
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <History className="w-4 h-4 text-indigo-500" /> History
                    </div>
                    {/* Timeframe Toggle */}
                    <div className="flex bg-slate-200 p-1 rounded-lg shrink-0">
                      <button 
                        onClick={() => { setHistoryTimeframe('weekly'); setReferenceDate(new Date()); }}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Week
                      </button>
                      <button 
                        onClick={() => { setHistoryTimeframe('monthly'); setReferenceDate(new Date()); }}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-slate-100">
                    <button onClick={() => shiftTimeframe(-1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-4 h-4"/></button>
                    <h3 className="font-bold text-slate-700 text-xs sm:text-sm text-center truncate px-2">
                      {rangeLabel}
                    </h3>
                    <button onClick={() => shiftTimeframe(1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-4 h-4"/></button>
                    
                    <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 ml-2">
                      <button 
                        onClick={() => setChartType('bar')}
                        className={`p-1 rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setChartType('line')}
                        className={`p-1 rounded-md transition-colors ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <LineChart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* The Chart Canvas */}
                <div className="relative h-32 w-full mt-2">
                  
                  {chartType === 'bar' ? (
                    /* BAR CHART */
                    <div className={`absolute inset-0 flex items-end justify-between px-1 ${historyTimeframe === 'weekly' ? 'gap-1' : 'gap-[1px]'}`}>
                      {historyData.map((dayData, i) => {
                        const heightPct = Math.max((dayData.pts / maxPoints) * 100, dayData.pts > 0 ? 8 : 0);
                        return (
                          <div key={i} className="flex flex-col items-center justify-end h-full flex-1 relative group">
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity z-20 whitespace-nowrap">
                              {dayData.dayLabel}: {dayData.pts} pts
                            </div>
                            
                            {/* Pay Day Indicator */}
                            {dayData.isPayDay && (
                              <div className="absolute -bottom-5 text-emerald-500 bg-emerald-100 rounded-full p-[1px] z-10" title="Pay Day!">
                                <DollarSign className="w-2.5 h-2.5" />
                              </div>
                            )}
                            
                            <div
                              className={`w-full rounded-t-sm transition-all duration-500 ${historyTimeframe === 'weekly' ? 'max-w-[24px]' : ''} ${dayData.isPayDay ? 'bg-emerald-400' : 'bg-amber-400'}`}
                              style={{ height: `${heightPct}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* LINE CHART (Daily Points) */
                    <div className="absolute inset-0 px-2 sm:px-4">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-slate-200 ml-2">
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                      </div>
                      
                      {/* The Line */}
                      <svg className="absolute inset-0 w-full h-full overflow-visible z-10 ml-2" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <polyline 
                          points={linePoints}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="drop-shadow-sm"
                        />
                      </svg>

                      {/* Line Chart Tooltips & Payday markers */}
                      <div className="absolute inset-0 flex justify-between ml-2">
                         {historyData.map((dayData, i) => (
                           <div key={i} className="h-full flex-1 relative group z-20">
                             <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity -translate-x-1/2 whitespace-nowrap">
                               {dayData.dayLabel}: {dayData.pts} pts
                             </div>
                             {dayData.isPayDay && (
                               <div className="absolute -bottom-5 text-emerald-500 bg-emerald-100 rounded-full p-[1px] -translate-x-1/2" title="Pay Day!">
                                 <DollarSign className="w-2.5 h-2.5" />
                               </div>
                             )}
                           </div>
                         ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between px-1">
                  {historyData.map((dayData, i) => (
                    <div 
                      key={i} 
                      className={`font-bold uppercase flex-1 text-center truncate ${historyTimeframe === 'monthly' ? 'text-[8px] sm:text-[10px]' : 'text-[10px]'} ${dayData.isPayDay ? 'text-emerald-600' : 'text-slate-400'}`}
                    >
                      {shouldShowLabel(i, historyData.length) ? dayData.dayLabel : ''}
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}