import { useState, useEffect } from 'react';
import { Save, Play, Plus, Trash2, Type, Palette, Wand2, X, Loader2, CheckCircle2, Image as ImageIcon, Video, Music, PlayCircle, Upload } from 'lucide-react';
import { doc, getDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCelebration, EFFECTS, CELEB_PALETTES, DEFAULT_CELEBRATION, POPULAR_EMOJIS } from '../../hooks/useCelebration';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../../hooks/useTheme';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';
import { playAudio } from '../../utils/audioPlayer';

export default function ThemeTab() {
  const { settings: celebSettings, loading: celebLoading, saveSettings: saveCeleb, triggerCelebration } = useCelebration();
  const { theme, loading: themeLoading, saveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('theme');
  const [celebSoundOptions, setCelebSoundOptions] = useState([]);

  // Library State for Avatars and Global Sounds
  const [avatarLibrary, setAvatarLibrary] = useState([]);
  const [soundLibrary, setSoundLibrary] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingLibrarySound, setUploadingLibrarySound] = useState(false);

  const [celebForm, setCelebForm] = useState(celebSettings || DEFAULT_CELEBRATION);
  const [themeForm, setThemeForm] = useState(theme);
  
  const [wallpaperFile, setWallpaperFile] = useState(null);
  const [wallpaperPreviewUrl, setWallpaperPreviewUrl] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);
  
  const [isSavingCeleb, setIsSavingCeleb] = useState(false);
  const [celebSaved, setCelebSaved] = useState(false);
  
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));

  // Fetch libraries
  useEffect(() => {
    getDoc(doc(db, 'settings', 'avatars')).then(snap => { if (snap.exists()) setAvatarLibrary(snap.data().urls || []); });
    getDoc(doc(db, 'settings', 'sounds')).then(snap => { if (snap.exists()) setSoundLibrary(snap.data().items || []); });
    getDoc(doc(db, 'settings', 'celebSounds')).then(snap => {
      if (snap.exists() && snap.data().items) setCelebSoundOptions(snap.data().items);
    });
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('themePreviewUpdate', { detail: { ...themeForm, bgPreview: wallpaperPreviewUrl } }));
    return () => window.dispatchEvent(new CustomEvent('themePreviewUpdate', { detail: null }));
  }, [themeForm, wallpaperPreviewUrl]);

  useEffect(() => { if (celebSettings) setCelebForm(celebSettings); }, [celebSettings]);
  useEffect(() => { setThemeForm(theme); }, [theme]);

  if (celebLoading && themeLoading && !themeForm?.bgColor) {
    return <div className="p-4 text-slate-500 font-medium animate-pulse">Loading settings...</div>;
  }

  const applyLocalOverride = (val) => {
    setLocalOverride(val);
    if (val !== null && val !== '') {
      localStorage.setItem('bgPositionOverride', val);
      window.dispatchEvent(new Event('localBgOverrideChanged'));
    } else {
      localStorage.removeItem('bgPositionOverride');
      window.dispatchEvent(new Event('localBgOverrideChanged'));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("⚠️ Invalid file type. Please select a JPG, PNG, or WEBP image.");
      e.target.value = '';
      return;
    }

    setWallpaperFile(file);
    setThemeForm(prev => ({ ...prev, preset: 'custom' }));
    if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl);
    setWallpaperPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      let finalUrl = themeForm.bgImageUrl;
      if (wallpaperFile) {
        const optimizedBlob = await compressImage(wallpaperFile, 1920, 1080, 0.85);
        finalUrl = await uploadToCloudflare(optimizedBlob, `bg_${Date.now()}.jpg`);
      }
      const updatedTheme = { ...themeForm, bgImageUrl: finalUrl, preset: (finalUrl || themeForm.bgColor) ? 'custom' : themeForm.preset };
      await saveTheme(updatedTheme);
      setThemeForm(updatedTheme);
      
      if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl);
      setWallpaperPreviewUrl(null);
      setWallpaperFile(null);
      
      const bgInput = document.getElementById('theme-bg-upload');
      if (bgInput) bgInput.value = '';

      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    } catch (e) {
      alert("Failed to save theme to the database.");
    }
    setIsSavingTheme(false);
  };

  const handlePreviewStart = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '0';
  };
  
  const handlePreviewEnd = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '1';
  };

  // --- Avatar & Sound Library Handlers ---
  const handleUploadToLibrary = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const url = await uploadToCloudflare(optimizedBlob, `library_${Date.now()}.jpg`);
      setAvatarLibrary(prev => [...prev, url]);
      await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayUnion(url) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    }
    setUploadingAvatar(false);
  };

  const handleDeleteFromLibrary = async (url) => {
    if (!window.confirm("Remove this avatar from the library?")) return;
    setAvatarLibrary(prev => prev.filter(u => u !== url));
    await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayRemove(url) }, { merge: true });
  };

  const handleUploadLibrarySound = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    const soundName = window.prompt("Give this signature sound a short name:");
    if (!soundName) return;
    setUploadingLibrarySound(true);
    try {
      const url = await uploadToCloudflare(file, `sound_${Date.now()}_${file.name}`);
      setSoundLibrary(prev => [...prev, { name: soundName, url }]);
      await setDoc(doc(db, 'settings', 'sounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    }
    setUploadingLibrarySound(false);
    e.target.value = '';
  };

  const handleDeleteLibrarySound = async (soundObj) => {
    if (!window.confirm(`Remove "${soundObj.name}" from library?`)) return;
    setSoundLibrary(prev => prev.filter(s => s.url !== soundObj.url));
    await setDoc(doc(db, 'settings', 'sounds'), { items: arrayRemove(soundObj) }, { merge: true });
  };

  // --- Celebration Uploads ---
  const handleVideoUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      return alert("⚠️ Video file is too large. Please keep celebration videos under 15MB.");
    }
    setUploadingVideo(true);
    try {
      const url = await uploadToCloudflare(file, `celeb_video_global_${Date.now()}_${file.name}`);
      setCelebForm({ ...celebForm, videoUrl: url, type: 'video' });
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleCustomAudioUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `custom_sound_global_${Date.now()}_${file.name}`);
      const soundName = window.prompt("Name this Celebration Audio track:") || "Custom Audio";
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
      
      setCelebSoundOptions(prev => [...prev, { name: soundName, url }]);
      setCelebForm({ ...celebForm, soundUrl: url });
    } catch (err) {
      alert("Failed to upload audio.");
    } finally {
      setUploadingSound(false);
      e.target.value = '';
    }
  };

  const handleSaveCeleb = async () => {
    setIsSavingCeleb(true);
    await saveCeleb(celebForm);
    setIsSavingCeleb(false);
    setCelebSaved(true);
    setTimeout(() => setCelebSaved(false), 2000);
  };

  const addLayer = () => {
    if ((celebForm.layers || []).length >= 4) return;
    setCelebForm(prev => ({ ...prev, layers: [...(prev.layers || []), { type: 'realistic-burst', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 }] }));
  };

  const updateLayer = (index, field, value) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setCelebForm(prev => ({ ...prev, layers: newLayers }));
  };

  const removeLayer = (index) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers.splice(index, 1);
    setCelebForm(prev => ({ ...prev, layers: newLayers }));
  };

  const localOverrideActive = localOverride !== null && localOverride !== '';

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner overflow-x-auto hide-scrollbar">
        <button onClick={() => setActiveTab('theme')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
          <Palette className="w-4 h-4" /> App Theme
        </button>
        <button onClick={() => setActiveTab('celebration')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'celebration' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
          <Wand2 className="w-4 h-4" /> Celebration FX
        </button>
        <button onClick={() => setActiveTab('avatars')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'avatars' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
          <ImageIcon className="w-4 h-4" /> Avatar Library
        </button>
        <button onClick={() => setActiveTab('sounds')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeTab === 'sounds' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
          <Music className="w-4 h-4" /> Sound Library
        </button>
      </div>

      {activeTab === 'theme' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div><h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">Visual Customization</h3><p className="text-slate-500 text-sm">Select presets or upload a custom background.</p></div>
            
            <button 
              onMouseDown={handlePreviewStart} 
              onMouseUp={handlePreviewEnd} 
              onMouseLeave={handlePreviewEnd}
              onTouchStart={handlePreviewStart}
              onTouchEnd={handlePreviewEnd}
              className="py-2 px-4 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-lg cursor-pointer select-none"
            >
              👁️ Hold to Preview
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Presets</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {THEME_PRESETS.map(p => (
                  <button key={p.id} onClick={() => { setThemeForm({ ...themeForm, preset: p.id }); setWallpaperFile(null); if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl); setWallpaperPreviewUrl(null); }} className={`p-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${themeForm.preset === p.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-200'}`} style={{ background: p.bg || '#e2e8f0', color: p.font }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Background Image</label>
                {(themeForm.bgImageUrl || wallpaperPreviewUrl) && (
                  <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-slate-100">
                    <img src={wallpaperPreviewUrl ? wallpaperPreviewUrl : themeForm.bgImageUrl} className="w-full h-full object-cover" alt="Background Preview" />
                    <button onClick={() => { setThemeForm({...themeForm, bgImageUrl: '', preset: 'default'}); setWallpaperFile(null); if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl); setWallpaperPreviewUrl(null); const el = document.getElementById('theme-bg-upload'); if (el) el.value = ''; }} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 font-bold transition-colors cursor-pointer">
                  <ImageIcon className="w-5 h-5" /> {wallpaperPreviewUrl ? 'Select a Different Image' : 'Select Local Image'}
                  <input id="theme-bg-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fallback Background Color</label><input type="color" value={themeForm.bgColor || '#667eea'} onChange={e => setThemeForm({ ...themeForm, bgColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calendar Font Color</label><input type="color" value={themeForm.fontColor || '#1f2937'} onChange={e => setThemeForm({ ...themeForm, fontColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" /></div>
              </div>
            </div>

            <div>
              <label className="flex text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 items-center gap-1"><Type className="w-4 h-4"/> Global Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(f => (
                  <button key={f.id} onClick={() => setThemeForm({ ...themeForm, fontFamily: f.id })} className={`p-2 rounded-xl text-sm transition-all border-2 cursor-pointer ${themeForm.fontFamily === f.id ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`} style={{ fontFamily: f.css }}>{f.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Opacity</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelOpacity}%</span></div><input type="range" min="10" max="100" step="5" value={themeForm.panelOpacity} onChange={(e) => setThemeForm({...themeForm, panelOpacity: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
              <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Glass Blur</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelBlur}px</span></div><input type="range" min="0" max="24" step="2" value={themeForm.panelBlur} onChange={(e) => setThemeForm({...themeForm, panelBlur: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>

              {(themeForm.bgImageUrl || wallpaperPreviewUrl) && (
                <>
                  <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Desktop Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionDesktop ?? 50}%</span></div><input type="range" min="0" max="100" value={themeForm.bgPositionDesktop ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionDesktop: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
                  <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionMobile ?? 50}%</span></div><input type="range" min="0" max="100" value={themeForm.bgPositionMobile ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionMobile: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
                  <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600">🖥️ Local Device Override</label>
                      {localOverrideActive && <button onClick={() => applyLocalOverride('')} className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-sm hover:bg-rose-100 transition-colors">✕ Clear Override</button>}
                    </div>
                    <input type="range" min="0" max="100" value={localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50)} onChange={(e) => applyLocalOverride(e.target.value)} className={`w-full ${localOverrideActive ? 'accent-emerald-500' : 'accent-slate-300 opacity-60'}`}/>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button onClick={handleSaveTheme} disabled={isSavingTheme || themeSaved} className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${themeSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {isSavingTheme ? <Loader2 className="w-5 h-5 animate-spin" /> : (themeSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingTheme ? 'Uploading & Saving...' : (themeSaved ? 'Theme Saved!' : 'Save App Theme')}
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'celebration' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div><h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">Global Reward Popup</h3><p className="text-slate-500 text-sm">Plays when anyone finishes their chores.</p></div>
          
          <div className="flex bg-slate-200/50 p-1 rounded-xl shrink-0">
            <button onClick={() => { const val = { ...celebForm, type: 'particles' }; setCelebForm(val); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${(!celebForm.type || celebForm.type === 'particles') ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <Wand2 className="w-4 h-4" /> Particles
            </button>
            <button onClick={() => { const val = { ...celebForm, type: 'video' }; setCelebForm(val); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${celebForm.type === 'video' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <Video className="w-4 h-4" /> Video
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {celebForm.type === 'video' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Screen Video</label>
                {celebForm.videoUrl && (
                  <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-black">
                    <video src={celebForm.videoUrl} className="w-full h-full object-cover" controls />
                    <button onClick={() => setCelebForm({ ...celebForm, videoUrl: '' })} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                  {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {uploadingVideo ? 'Uploading...' : 'Upload Video (Max 15MB)'}
                  <input type="file" accept="video/mp4, video/webm, video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
                </label>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                  <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                    <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds</option><option value={15}>15 Seconds</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Long Audio Track</label>
                    <select value={celebForm.soundUrl || ''} onChange={e => setCelebForm({ ...celebForm, soundUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-white transition-colors cursor-pointer">
                      <option value="">No Sound (Silent)</option>
                      {celebSoundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                      {celebForm.soundUrl && !celebSoundOptions.find(s => s.url === celebForm.soundUrl) && <option value={celebForm.soundUrl}>🎙️ Custom Uploaded Audio</option>}
                    </select>
                  </div>
                  
                  <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                    {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    {uploadingSound ? 'Uploading...' : 'Upload Own Audio (Max 5MB)'}
                    <input type="file" accept="audio/*" className="hidden" onChange={handleCustomAudioUpload} disabled={uploadingSound} />
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                    <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-white transition-colors cursor-pointer">
                      <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds (Long)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({celebForm.layers?.length || 0}/4)</label>
                  {(celebForm.layers || []).map((layer, index) => {
                    // Backwards compatible Emoji UI State
                    const currentEmojis = layer.emojis || (layer.emojiChar ? [layer.emojiChar] : ['😀']);

                    return (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 relative shadow-sm">
                        <button onClick={() => removeLayer(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                        <div className="space-y-3 pr-6">
                          <div>
                            <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer">
                              {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                            </select>
                          </div>
                          
                          {/* ROBUST EMOJI PICKER IMPLEMENTATION */}
                          {layer.type === 'emoji' ? (
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Select Emojis (Max 3)</label>
                                <span className="text-[9px] text-slate-400">{currentEmojis.length}/3</span>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                                {currentEmojis.map((emo, i) => (
                                  <span key={i} className="bg-white border border-slate-200 shadow-sm text-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                                    {emo} 
                                    <button type="button" onClick={() => {
                                      const newEmojis = currentEmojis.filter((_, idx) => idx !== i);
                                      updateLayer(index, 'emojis', newEmojis);
                                    }} className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"><X className="w-3 h-3"/></button>
                                  </span>
                                ))}
                                {currentEmojis.length === 0 && <span className="text-xs text-slate-400 italic py-0.5 px-1">None selected</span>}
                              </div>
                              
                              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 h-32 overflow-y-auto custom-scrollbar p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                                {POPULAR_EMOJIS.map(emo => (
                                  <button 
                                    key={emo}
                                    type="button"
                                    onClick={() => {
                                      if (currentEmojis.length < 3 && !currentEmojis.includes(emo)) {
                                        updateLayer(index, 'emojis', [...currentEmojis, emo]);
                                      }
                                    }}
                                    className="hover:bg-white hover:shadow-sm rounded p-1 text-xl transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
                                  >
                                    {emo}
                                  </button>
                                ))}
                              </div>
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
                    );
                  })}
                  {(celebForm.layers || []).length < 4 && <button onClick={addLayer} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-400 transition-colors text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Layer</button>}
                </div>
              </>
            )}
            
            <button onClick={() => triggerCelebration(celebForm)} className="w-full py-3 mt-4 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
              <Play className="w-5 h-5 fill-current" /> Preview Full Blast
            </button>
            <button onClick={handleSaveCeleb} disabled={isSavingCeleb || celebSaved} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer">
              {isSavingCeleb ? <Loader2 className="w-5 h-5 animate-spin" /> : (celebSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
              {isSavingCeleb ? 'Saving...' : (celebSaved ? 'Effects Saved!' : 'Save Effects')}
            </button>
          </div>
        </section>
      )}

      {activeTab === 'avatars' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Default Avatar Library</h3>
              <p className="text-xs text-slate-500 mt-1">Images uploaded here will be available for kids to choose from in their profile modal.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {avatarLibrary.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl border-2 border-slate-200 overflow-hidden group bg-slate-50 shadow-sm">
                <img src={url} alt="Library Avatar" className="w-full h-full object-cover" />
                <button onClick={() => handleDeleteFromLibrary(url)} className="absolute top-1 right-1 bg-rose-500/90 text-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
              {uploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{uploadingAvatar ? '...' : 'Upload'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadToLibrary} disabled={uploadingAvatar} />
            </label>
          </div>
        </section>
      )}

      {activeTab === 'sounds' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Music className="w-5 h-5 text-indigo-500" /> Signature Sound Library</h3>
              <p className="text-xs text-slate-500 mt-1">Short audio files (MP3/WAV) uploaded here can be selected by kids as their chore completion sound.</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold cursor-pointer hover:bg-indigo-100 transition-colors shadow-sm text-sm shrink-0">
              {uploadingLibrarySound ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploadingLibrarySound ? 'Uploading...' : 'Upload Sound (Max 5MB)'}
              <input type="file" accept="audio/*" className="hidden" onChange={handleUploadLibrarySound} disabled={uploadingLibrarySound} />
            </label>
          </div>
          
          <div className="space-y-2 mt-4">
            {soundLibrary.length === 0 && <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">No custom sounds added yet. Use the System Tools tab to restore defaults!</div>}
            {soundLibrary.map((sound, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => playAudio(sound.url)} className="text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"><PlayCircle className="w-6 h-6" /></button>
                  <span className="font-bold text-slate-700">{sound.name}</span>
                </div>
                <button onClick={() => handleDeleteLibrarySound(sound)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer bg-white rounded-md shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}