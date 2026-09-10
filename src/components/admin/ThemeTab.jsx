import { useState, useEffect } from 'react';
import { Save, Play, Plus, Trash2, Type, Palette, Wand2, X, Loader2, CheckCircle2, Image as ImageIcon, Video, Music } from 'lucide-react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCelebration, EFFECTS, CELEB_PALETTES, DEFAULT_CELEBRATION } from '../../hooks/useCelebration';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../../hooks/useTheme';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

export default function ThemeTab() {
  const { settings: celebSettings, loading: celebLoading, saveSettings: saveCeleb, triggerCelebration } = useCelebration();
  const { theme, loading: themeLoading, saveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('theme');
  const [celebSoundOptions, setCelebSoundOptions] = useState([]);

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

  useEffect(() => {
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

  // RESTORED THE MISSING FUNCTIONS HERE
  const handlePreviewStart = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '0';
  };
  
  const handlePreviewEnd = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '1';
  };

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
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner">
        <button onClick={() => setActiveTab('theme')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Palette className="w-4 h-4" /> App Theme</button>
        <button onClick={() => setActiveTab('celebration')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'celebration' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Wand2 className="w-4 h-4" /> Celebration FX</button>
      </div>

      {activeTab === 'theme' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div><h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">Visual Customization</h3><p className="text-slate-500 text-sm">Select presets or upload a custom background.</p></div>
            
            {/* THIS BUTTON NOW WORKS! */}
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
                    {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
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
            <button onClick={handleSaveCeleb} disabled={isSavingCeleb || celebSaved} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer">
              {isSavingCeleb ? <Loader2 className="w-5 h-5 animate-spin" /> : (celebSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
              {isSavingCeleb ? 'Saving...' : (celebSaved ? 'Effects Saved!' : 'Save Effects')}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}