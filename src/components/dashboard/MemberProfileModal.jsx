// src/components/dashboard/MemberProfileModal.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Wallet, Star, Loader2, UserCircle, History, BarChart3, LineChart, ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

export default function MemberProfileModal({ member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Instant visual update state for the avatar
  const [previewAvatar, setPreviewAvatar] = useState('');

  // Settings Data
  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [soundOptions, setSoundOptions] = useState([]);
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); 

  // History State
  const [historyData, setHistoryData] = useState([]);
  const [timeframePoints, setTimeframePoints] = useState(0);

  // Chart Controls
  const [chartType, setChartType] = useState('bar');
  const [historyTimeframe, setHistoryTimeframe] = useState('weekly');
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  useEffect(() => {
    if (member?.avatar) setPreviewAvatar(member.avatar);
  }, [member?.avatar]);

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

  useEffect(() => {
    if (!member) return;

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

    const q = query(collection(db, 'completions'), where('completedBy', '==', member.id));
    const unsub = onSnapshot(q, (snapshot) => {
      let currentRangePts = 0;
      const dailyMap = {};
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
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
        if (date >= startOfRange && date <= endOfRange) {
          const pts = Number(data.points) || 0;
          currentRangePts += pts;
          const dateString = date.toDateString();
          if (dailyMap[dateString]) {
            dailyMap[dateString].pts += pts;
          }
        }
      });

      const chartArray = Object.values(dailyMap).sort((a, b) => a.dateObj - b.dateObj);
      setTimeframePoints(currentRangePts);
      setHistoryData(chartArray);
    }, (error) => {
      console.error("Error fetching history:", error);
    });

    return () => unsub();
  }, [member, referenceDate, historyTimeframe, allowanceConfig.payDay]);

  if (!member) return null;

  const payRate = member.payRate || 0;
  const timeframeEarned = (timeframePoints * payRate).toFixed(2);
  const maxPoints = Math.max(...historyData.map(d => d.pts), 10);

  const linePoints = historyData.map((d, i) => {
    const x = (i / (historyData.length - 1 || 1)) * 100;
    const y = 95 - ((d.pts / maxPoints) * 90);
    return `${x},${y}`;
  }).join(' ');

  const handleUpdateSetting = async (field, value) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert("Failed to save changes.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target?.files?.[0];
    const inputElement = e.target;
    
    if (!file) return;

    setUploading(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const safeName = `avatar_${member.id}_${Date.now()}.jpg`; 
      const downloadUrl = await uploadToCloudflare(optimizedBlob, safeName);
      
      setPreviewAvatar(downloadUrl); // Update visually instantly
      await handleUpdateSetting('avatar', downloadUrl); // Save to DB
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to compress and upload image to Cloudflare.");
    } finally {
      if (inputElement) inputElement.value = '';
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

  let rangeLabel = '';
  const now = new Date();
  let isCurrentTimeframe = false;

  if (historyTimeframe === 'weekly') {
    const wStart = new Date(referenceDate);
    wStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 6);
    rangeLabel = `${wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
    
    isCurrentTimeframe = now >= wStart && now <= new Date(wEnd.setHours(23, 59, 59));
  } else {
    rangeLabel = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    isCurrentTimeframe = now.getMonth() === referenceDate.getMonth() && now.getFullYear() === referenceDate.getFullYear();
  }

  const shouldShowLabel = (index, total) => {
    if (historyTimeframe === 'weekly') return true;
    if (index === 0 || index === total - 1) return true;
    return index % 5 === 0;
  };

  const displayColor = member.color || '#6366f1';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header Section */}
        <div className="p-6 text-center relative shrink-0" style={{ backgroundColor: displayColor }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none" >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-4 mb-3 group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center text-3xl font-black text-white" style={{ backgroundColor: displayColor }} >
              {previewAvatar || member.avatar ? (
                <img src={previewAvatar || member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100" >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{member.name}</h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider mt-2 inline-block">
            {member.participatesInChores === true || String(member.participatesInChores).toLowerCase() === 'true' ? 'Kid Profile' : 'Adult Profile'}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-slate-50/50">
          {isEditing ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
                  <Volume2 className="w-4 h-4" /> Signature Sound
                </label>
                <select value={member.signatureSound || ''} onChange={(e) => handleUpdateSetting('signatureSound', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500" >
                  <option value="">Default Pop</option>
                  {soundOptions.map((s, idx) => (
                    <option key={idx} value={s.url}>{s.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 pl-1">This plays when you complete a chore!</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                  <ImageIcon className="w-4 h-4" /> Choose an Avatar
                </label>
                {defaultAvatars.length === 0 ? (
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <UserCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No default avatars available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {defaultAvatars.map((url, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          setPreviewAvatar(url); // Instant Update!
                          handleUpdateSetting('avatar', url);
                        }} 
                        className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden focus:outline-none" 
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
                  <span className="bg-slate-50 px-2 text-slate-400 uppercase font-bold tracking-wider">Or</span>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>

              <button onClick={() => setIsEditing(false)} className="w-full py-3 bg-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-300 transition-colors focus:outline-none" >
                Done Editing
              </button>
            </div>
          ) : (
            <>
              {/* Top Controls: Timeframe Toggle & Date Navigation */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200 shadow-inner">
                    <button onClick={() => { setHistoryTimeframe('weekly'); setReferenceDate(new Date()); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Week
                    </button>
                    <button onClick={() => { setHistoryTimeframe('monthly'); setReferenceDate(new Date()); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Month
                    </button>
                  </div>
                  <button onClick={() => setReferenceDate(new Date())} className={`flex items-center gap-1.5 py-1.5 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg border border-indigo-100 transition-all duration-300 ${isCurrentTimeframe ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`} >
                    <RotateCcw className="w-3.5 h-3.5" /> Current {historyTimeframe === 'weekly' ? 'Week' : 'Month'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                  <button onClick={() => shiftTimeframe(-1)} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800" >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-bold text-slate-700 text-sm sm:text-base text-center px-2">
                    {rangeLabel}
                  </h3>
                  <button onClick={() => shiftTimeframe(1)} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800" >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Earnings Boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                  <Star className="absolute -right-4 -bottom-4 w-20 h-20 text-amber-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-xs font-black text-amber-600/80 uppercase tracking-widest mb-1 relative z-10">Stars</div>
                  <div className="text-3xl font-black text-amber-600 relative z-10">
                    {timeframePoints}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                  <Wallet className="absolute -right-4 -bottom-4 w-20 h-20 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-xs font-black text-emerald-600/80 uppercase tracking-widest mb-1 relative z-10">Earnings</div>
                  <div className="text-3xl font-black text-emerald-600 relative z-10">
                    ${timeframeEarned}
                  </div>
                </div>
              </div>

              {/* Advanced History Chart */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
                    <History className="w-4 h-4 text-slate-400" /> Hustle History
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
                    <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setChartType('line')} className={`p-1.5 rounded-md transition-colors ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} >
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative h-32 w-full mt-2">
                  {chartType === 'bar' ? (
                    <div className={`absolute inset-0 flex items-end justify-between px-1 ${historyTimeframe === 'weekly' ? 'gap-1' : 'gap-[1px]'}`}>
                      {historyData.map((dayData, i) => {
                        const heightPct = Math.max((dayData.pts / maxPoints) * 100, dayData.pts > 0 ? 4 : 0);
                        return (
                          <div key={i} className="flex flex-col items-center justify-end h-full flex-1 relative group">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none transition-opacity z-20 shadow-md">
                              {dayData.pts}
                            </div>
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 relative ${dayData.isPayDay ? 'ring-1 ring-emerald-400 ring-offset-[1px]' : ''}`} 
                              style={{ 
                                height: `${heightPct}%`, 
                                backgroundColor: dayData.pts > 0 ? displayColor : '#e2e8f0',
                                opacity: dayData.pts > 0 ? 0.9 : 1
                              }}
                            >
                                {dayData.isPayDay && dayData.pts > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="absolute inset-0 px-2">
                      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-slate-200 pb-0.5">
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                      </div>
                      <svg className="absolute inset-0 w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id={`grad-${member.id}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={displayColor} stopOpacity="0.2"/>
                            <stop offset="100%" stopColor={displayColor} stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <polygon points={`0,100 ${linePoints} 100,100`} fill={`url(#grad-${member.id})`} />
                        <polyline 
                          points={linePoints} 
                          fill="none" 
                          stroke={displayColor} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-sm" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex justify-between pb-0.5">
                        {historyData.map((dayData, i) => (
                          <div key={i} className="h-full flex-1 relative group z-20 flex items-end justify-center">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none transition-opacity -translate-x-1/2 whitespace-nowrap shadow-md">
                              {dayData.dayLabel}: {dayData.pts} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 flex justify-between px-1 border-t border-slate-100 pt-2">
                  {historyData.map((dayData, i) => (
                    <div key={i} className={`font-bold uppercase flex-1 text-center truncate text-[10px] ${dayData.isPayDay ? 'text-emerald-600' : 'text-slate-400'}`} style={{ color: (historyTimeframe === 'monthly' && !shouldShowLabel(i, historyData.length)) ? 'transparent' : undefined }}>
                      {shouldShowLabel(i, historyData.length) ? dayData.dayLabel : '.'}
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}