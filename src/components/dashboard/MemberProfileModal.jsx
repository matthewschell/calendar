import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Wallet, Star, Loader2, UserCircle, History, BarChart3, LineChart, ChevronLeft, ChevronRight, RotateCcw, Volume2, Play, Music, Wand2, Trash2, Video, Plus } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';
import { playAudio } from '../../utils/audioPlayer';
import { EFFECTS, CELEB_PALETTES, DEFAULT_CELEBRATION, useCelebration } from '../../hooks/useCelebration';

const DEFAULT_DING_URL = "https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3";

export default function MemberProfileModal({ member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState('avatar'); 
  
  const [uploading, setUploading] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [localSound, setLocalSound] = useState('');
  
  const [celebForm, setCelebForm] = useState(DEFAULT_CELEBRATION);
  const { triggerCelebration } = useCelebration();
  
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [soundOptions, setSoundOptions] = useState([]);
  const [celebSoundOptions, setCelebSoundOptions] = useState([]);
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); 
  const [historyData, setHistoryData] = useState([]);
  const [timeframePoints, setTimeframePoints] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const [historyTimeframe, setHistoryTimeframe] = useState('weekly');
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  useEffect(() => { 
    if (member?.avatar) setPreviewAvatar(member.avatar); 
    if (member) setLocalSound(member.signatureSound || '');
    if (member?.customCelebration) setCelebForm({ ...DEFAULT_CELEBRATION, ...member.customCelebration });
  }, [member]);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'avatars')).then(snap => { if (snap.exists()) setDefaultAvatars(snap.data().urls || []); });
    getDoc(doc(db, 'settings', 'sounds')).then(snap => { if (snap.exists()) setSoundOptions(snap.data().items || []); });
    getDoc(doc(db, 'settings', 'celebSounds')).then(snap => { if (snap.exists()) setCelebSoundOptions(snap.data().items || []); });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => { if (docSnap.exists()) setAllowanceConfig(docSnap.data()); });
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

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const date = data.timestamp?.toDate();
        if (!date) return;
        if (date >= startOfRange && date <= endOfRange) {
          const pts = Number(data.points) || 0;
          currentRangePts += pts;
          if (dailyMap[date.toDateString()]) dailyMap[date.toDateString()].pts += pts;
        }
      });

      setHistoryData(Object.values(dailyMap).sort((a, b) => a.dateObj - b.dateObj));
      setTimeframePoints(currentRangePts);
    });

    return () => unsub();
  }, [member?.id, referenceDate, historyTimeframe, allowanceConfig.payDay]);

  if (!member) return null;

  const handleEditClick = () => {
    if (member.pin) setPinPrompt(true);
    else setIsEditing(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === member.pin) {
      setPinPrompt(false);
      setIsEditing(true);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleUpdateSetting = async (field, value) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), { [field]: value });
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const safeName = `avatar_${member.id}_${Date.now()}.jpg`; 
      const downloadUrl = await uploadToCloudflare(optimizedBlob, safeName);
      setPreviewAvatar(downloadUrl); 
      await handleUpdateSetting('avatar', downloadUrl); 
    } catch (error) {
      alert("Failed to compress and upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCustomAudioUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { // INCREASED TO 5MB
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `custom_sound_${member.id}_${Date.now()}_${file.name}`);
      const soundName = window.prompt("Name this Celebration Audio track:") || "Custom Audio";
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
      setCelebSoundOptions(prev => [...prev, { name: soundName, url }]);
      const newConfig = { ...celebForm, soundUrl: url };
      setCelebForm(newConfig);
      await handleUpdateSetting('customCelebration', newConfig);
    } catch (err) {
      alert("Failed to upload audio.");
    } finally {
      setUploadingSound(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      return alert("⚠️ Video file is too large. Please keep celebration videos under 15MB.");
    }
    setUploadingVideo(true);
    try {
      const url = await uploadToCloudflare(file, `celeb_video_${member.id}_${Date.now()}_${file.name}`);
      const newConfig = { ...celebForm, videoUrl: url, type: 'video' };
      setCelebForm(newConfig);
      await handleUpdateSetting('customCelebration', newConfig);
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const shiftTimeframe = (offset) => {
    setReferenceDate(prev => {
      const next = new Date(prev);
      if (historyTimeframe === 'weekly') next.setDate(prev.getDate() + (offset * 7));
      else next.setMonth(prev.getMonth() + offset);
      return next;
    });
  };

  const addLayer = () => {
    if ((celebForm.layers || []).length >= 4) return;
    const newConfig = { ...celebForm, layers: [...(celebForm.layers || []), { type: 'realistic-burst', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 }] };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const updateLayer = (index, field, value) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers[index] = { ...newLayers[index], [field]: value };
    const newConfig = { ...celebForm, layers: newLayers };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const removeLayer = (index) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers.splice(index, 1);
    const newConfig = { ...celebForm, layers: newLayers };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const toggleCustomCelebration = (enabled) => {
    const newConfig = { ...celebForm, enabled };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const displayColor = member.color || '#6366f1';
  const payRate = member.payRate || 0;
  const timeframeEarned = (timeframePoints * payRate).toFixed(2);
  const maxPoints = Math.max(...historyData.map(d => d.pts), 10);
  const linePoints = historyData.map((d, i) => `${(i / (historyData.length - 1 || 1)) * 100},${95 - ((d.pts / maxPoints) * 90)}`).join(' ');

  let rangeLabel = '';
  const now = new Date();
  let isCurrentTimeframe = false;

  if (historyTimeframe === 'weekly') {
    const wStart = new Date(referenceDate); wStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const wEnd = new Date(wStart); wEnd.setDate(wStart.getDate() + 6);
    rangeLabel = `${wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
    isCurrentTimeframe = now >= wStart && now <= new Date(wEnd.setHours(23, 59, 59));
  } else {
    rangeLabel = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    isCurrentTimeframe = now.getMonth() === referenceDate.getMonth() && now.getFullYear() === referenceDate.getFullYear();
  }

  const shouldShowLabel = (index, total) => historyTimeframe === 'weekly' || index === 0 || index === total - 1 || index % 5 === 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      
      {pinPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setPinPrompt(false); }}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Profile Locked</h3>
            <p className="text-slate-500 mb-6 text-sm">Enter PIN to edit {member.name}'s profile.</p>
            <form onSubmit={handlePinSubmit}>
              <input 
                type="password" value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPinError(false); }} 
                maxLength={4} autoFocus 
                className={`w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 rounded-xl mb-4 focus:outline-none transition-colors ${pinError ? 'border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-indigo-500'}`} 
                placeholder="••••" 
              />
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-5 text-center relative shrink-0" style={{ backgroundColor: displayColor }}>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none cursor-pointer" >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-2 mb-2 group">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center text-3xl font-black text-white" style={{ backgroundColor: displayColor }} >
              {previewAvatar || member.avatar ? (
                <img src={previewAvatar || member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            {!isEditing && (
              <button onClick={handleEditClick} className="absolute bottom-0 right-0 bg-white text-indigo-600 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100 cursor-pointer" >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{member.name}</h2>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider mt-1 inline-block">
            {member.participatesInChores === true || String(member.participatesInChores).toLowerCase() === 'true' ? 'Kid Profile' : 'Adult Profile'}
          </span>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-slate-50/50">
          {isEditing ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex bg-slate-200/50 p-1 rounded-xl mb-4 shrink-0 overflow-x-auto hide-scrollbar">
                <button onClick={() => setEditTab('avatar')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'avatar' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <ImageIcon className="w-4 h-4" /> Avatar
                </button>
                <button onClick={() => setEditTab('sound')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'sound' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Volume2 className="w-4 h-4" /> Ding
                </button>
                <button onClick={() => setEditTab('celeb')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'celeb' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Wand2 className="w-4 h-4" /> 🎉 Celeb
                </button>
              </div>

              {editTab === 'avatar' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {defaultAvatars.length === 0 ? (
                    <div className="text-center p-4 bg-white rounded-xl border border-slate-200 mb-4">
                      <UserCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">No default avatars available.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar p-1 mb-4">
                      {defaultAvatars.map((url, idx) => (
                        <button key={idx} onClick={() => { setPreviewAvatar(url); handleUpdateSetting('avatar', url); }} className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden focus:outline-none cursor-pointer" >
                          <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors mt-auto shrink-0">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              )}

              {editTab === 'sound' && (
                <div className="flex-1">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      Select Signature Sound
                    </label>
                    <select 
                      value={localSound || DEFAULT_DING_URL} 
                      onChange={(e) => { setLocalSound(e.target.value); handleUpdateSetting('signatureSound', e.target.value); }} 
                      className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer text-sm mb-4" 
                    >
                      <option value={DEFAULT_DING_URL}>🔔 Default Ding</option>
                      {soundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                      {localSound && localSound !== DEFAULT_DING_URL && !soundOptions.find(s => s.url === localSound) && (
                        <option value={localSound}>🎙️ Custom Uploaded Sound</option>
                      )}
                    </select>
                    
                    <button onClick={() => playAudio(localSound || DEFAULT_DING_URL)} className="w-full bg-indigo-100 text-indigo-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
                      <Play className="w-5 h-5 fill-current" /> Preview Sound
                    </button>
                    <p className="text-xs text-slate-400 mt-4 text-center">This tiny sound plays instantly when you check off a single chore.</p>
                  </div>
                </div>
              )}

              {editTab === 'celeb' && (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between mb-4 shrink-0">
                    <div>
                      <h4 className="font-bold text-amber-900 flex items-center gap-2">Custom Reward!</h4>
                      <p className="text-xs text-amber-700 mt-1">Override the global celebration.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" checked={celebForm.enabled || false} onChange={(e) => toggleCustomCelebration(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {celebForm.enabled && (
                    <div className="space-y-4 animate-in fade-in duration-300 pb-2">
                      
                      <div className="flex bg-slate-200/50 p-1 rounded-xl shrink-0">
                        <button 
                          onClick={() => { const val = { ...celebForm, type: 'particles' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} 
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${(!celebForm.type || celebForm.type === 'particles') ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <Wand2 className="w-4 h-4" /> Particles
                        </button>
                        <button 
                          onClick={() => { const val = { ...celebForm, type: 'video' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} 
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${celebForm.type === 'video' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <Video className="w-4 h-4" /> Video
                        </button>
                      </div>

                      {celebForm.type === 'video' ? (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Screen Video</label>
                          
                          {celebForm.videoUrl && (
                            <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-black">
                              <video src={celebForm.videoUrl} className="w-full h-full object-cover" controls />
                              <button onClick={() => { const val = { ...celebForm, videoUrl: '' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                            {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {uploadingVideo ? 'Uploading...' : 'Upload Video (Max 15MB)'}
                            <input type="file" accept="video/mp4, video/webm, video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
                          </label>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                            <select value={celebForm.duration} onChange={e => { const val = { ...celebForm, duration: Number(e.target.value) }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                              <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds</option><option value={15}>15 Seconds</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Long Audio Track</label>
                              <select value={celebForm.soundUrl || ''} onChange={e => { const val = { ...celebForm, soundUrl: e.target.value }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                                <option value="">No Sound (Silent)</option>
                                {celebSoundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                                {celebForm.soundUrl && !celebSoundOptions.find(s => s.url === celebForm.soundUrl) && (
                                  <option value={celebForm.soundUrl}>🎙️ Custom Uploaded Audio</option>
                                )}
                              </select>
                            </div>
                            
                            <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                              {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                              {uploadingSound ? 'Uploading...' : 'Upload Own Audio (Max 5MB)'}
                              <input type="file" accept="audio/*" className="hidden" onChange={handleCustomAudioUpload} disabled={uploadingSound} />
                            </label>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                              <select value={celebForm.duration} onChange={e => { const val = { ...celebForm, duration: Number(e.target.value) }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                                <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds (Long)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({(celebForm.layers || []).length}/4)</label>
                            {(celebForm.layers || []).map((layer, index) => (
                              <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 relative shadow-sm">
                                <button onClick={() => removeLayer(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                                <div className="space-y-3 pr-6">
                                  <div>
                                    <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer">
                                      {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                                    </select>
                                  </div>
                                  {layer.type === 'emoji' ? (
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type an Emoji 🦄🐾🚗</label>
                                      <input type="text" maxLength="2" value={layer.emojiChar || '😀'} onChange={(e) => updateLayer(index, 'emojiChar', e.target.value)} className="w-full p-2 text-2xl text-center border border-slate-200 rounded-lg focus:border-indigo-500" />
                                    </div>
                                  ) : (
                                    <div>
                                      <select value={JSON.stringify(layer.colors || CELEB_PALETTES[0].colors)} onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer mb-1.5">
                                        {CELEB_PALETTES.map(pal => <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>)}
                                      </select>
                                      <div className="flex h-1.5 rounded overflow-hidden">
                                        {(layer.colors || CELEB_PALETTES[0].colors).map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                                      </div>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Size</label><span className="text-[10px] text-indigo-500">{layer.scale}x</span></div><input type="range" min="0.5" max="3" step="0.1" value={layer.scale} onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                                    <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Amount</label><span className="text-[10px] text-indigo-500">{layer.intensity * 100}%</span></div><input type="range" min="0.2" max="2.5" step="0.1" value={layer.intensity} onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(celebForm.layers || []).length < 4 && <button onClick={addLayer} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-400 transition-colors text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Layer</button>}
                          </div>
                        </>
                      )}
                      
                      <button onClick={() => triggerCelebration(celebForm)} className="w-full py-3 mt-4 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
                        <Play className="w-5 h-5 fill-current" /> Preview Full Blast
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setIsEditing(false)} className="w-full py-4 mt-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors focus:outline-none cursor-pointer shrink-0 shadow-md" >
                Save & Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200 shadow-inner">
                    <button onClick={() => { setHistoryTimeframe('weekly'); setReferenceDate(new Date()); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${historyTimeframe === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Week
                    </button>
                    <button onClick={() => { setHistoryTimeframe('monthly'); setReferenceDate(new Date()); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${historyTimeframe === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Month
                    </button>
                  </div>
                  <button onClick={() => setReferenceDate(new Date())} className={`flex items-center gap-1.5 py-1 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg border border-indigo-100 transition-all duration-300 cursor-pointer ${isCurrentTimeframe ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`} >
                    <RotateCcw className="w-3.5 h-3.5" /> Current {historyTimeframe === 'weekly' ? 'Week' : 'Month'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                  <button onClick={() => shiftTimeframe(-1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800 cursor-pointer" ><ChevronLeft className="w-5 h-5" /></button>
                  <h3 className="font-bold text-slate-700 text-sm text-center px-2">{rangeLabel}</h3>
                  <button onClick={() => shiftTimeframe(1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800 cursor-pointer" ><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-3 shadow-sm relative overflow-hidden group">
                  <Star className="absolute -right-3 -bottom-3 w-16 h-16 text-amber-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest mb-1 relative z-10">Stars</div>
                  <div className="text-2xl font-black text-amber-600 relative z-10">{timeframePoints}</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-3 shadow-sm relative overflow-hidden group">
                  <Wallet className="absolute -right-3 -bottom-3 w-16 h-16 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-[10px] font-black text-emerald-600/80 uppercase tracking-widest mb-1 relative z-10">Earnings</div>
                  <div className="text-2xl font-black text-emerald-600 relative z-10">${timeframeEarned}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <History className="w-4 h-4 text-slate-400" /> Hustle History
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
                    <button onClick={() => setChartType('bar')} className={`p-1 rounded-md transition-colors cursor-pointer ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} ><BarChart3 className="w-4 h-4" /></button>
                    <button onClick={() => setChartType('line')} className={`p-1 rounded-md transition-colors cursor-pointer ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} ><LineChart className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="relative h-24 w-full mt-2">
                  {chartType === 'bar' ? (
                    <div className={`absolute inset-0 flex items-end justify-between px-1 ${historyTimeframe === 'weekly' ? 'gap-1' : 'gap-[1px]'}`}>
                      {historyData.map((dayData, i) => {
                        const heightPct = Math.max((dayData.pts / maxPoints) * 100, dayData.pts > 0 ? 4 : 0);
                        return (
                          <div key={i} className="flex flex-col items-center justify-end h-full flex-1 relative group">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-bold pointer-events-none transition-opacity z-20 shadow-md">
                              {dayData.pts}
                            </div>
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 relative ${dayData.isPayDay ? 'ring-1 ring-emerald-400 ring-offset-[1px]' : ''}`} 
                              style={{ height: `${heightPct}%`, backgroundColor: dayData.pts > 0 ? displayColor : '#e2e8f0', opacity: dayData.pts > 0 ? 0.9 : 1 }}
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
                        <polyline points={linePoints} fill="none" stroke={displayColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
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
                    <div key={i} className={`font-bold uppercase flex-1 text-center truncate text-[9px] ${dayData.isPayDay ? 'text-emerald-600' : 'text-slate-400'}`} style={{ color: (historyTimeframe === 'monthly' && !shouldShowLabel(i, historyData.length)) ? 'transparent' : undefined }}>
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