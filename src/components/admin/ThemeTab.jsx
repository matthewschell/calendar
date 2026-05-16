// src/components/admin/ThemeTab.jsx
import { useState, useEffect } from 'react';
import { PartyPopper, Save, Play, Plus, Trash2, Image as ImageIcon, UploadCloud, Type, Palette, Wand2, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../../hooks/useTheme';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

const EFFECTS = [
  { id: 'realistic-burst', label: '💥 Realistic Burst (Explode & Fall)' },
  { id: 'cannons', label: '🎉 Side Cannons' },
  { id: 'fireworks', label: '⭐ Giant Stars' },
  { id: 'rain', label: '🎊 Confetti Rain' },
  { id: 'snow', label: '❄️ Drifting Snow' },
  { id: 'center-burst', label: '🎆 Center Spinner' }
];

const CELEB_PALETTES = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#d946ef'] },
  { id: 'gold', label: 'Gold & Silver', colors: ['#FFD700', '#FFA500', '#DAA520', '#F8F8FF', '#C0C0C0'] },
  { id: 'neon', label: 'Neon Cyber', colors: ['#FF1493', '#00FFFF', '#39FF14', '#FF00FF'] },
  { id: 'pastel', label: 'Spring Pastels', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
  { id: 'blizzard', label: 'Winter Blizzard', colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'] },
  { id: 'schell', label: 'Schell Family Colors', colors: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'] }
];

export default function ThemeTab() {
  const { settings: celebSettings, loading: celebLoading, saveSettings: saveCeleb, triggerCelebration } = useCelebration();
  const { theme, loading: themeLoading, saveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('theme');

  const [celebForm, setCelebForm] = useState(celebSettings);
  const [themeForm, setThemeForm] = useState(theme);
  const [wallpaperFile, setWallpaperFile] = useState(null);
  
  // Save States
  const [isSavingCeleb, setIsSavingCeleb] = useState(false);
  const [celebSaved, setCelebSaved] = useState(false);
  
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));

  useEffect(() => { setCelebForm(celebSettings); }, [celebSettings]);
  useEffect(() => { setThemeForm(theme); }, [theme]);

  if (celebLoading || themeLoading) return <div className="animate-pulse">Loading settings...</div>;

  const activePreset = THEME_PRESETS.find(p => p.id === themeForm.preset) || THEME_PRESETS[0];
  const isCustom = themeForm.preset === 'custom';
  
  let bgStyle = '';
  if (isCustom) {
    if (themeForm.bgImageUrl || wallpaperFile) {
      const imgUrl = wallpaperFile ? URL.createObjectURL(wallpaperFile) : themeForm.bgImageUrl;
      bgStyle = `background-image: url(${imgUrl}); background-color: ${themeForm.bgColor || '#667eea'};`;
    } else {
      bgStyle = `background: ${themeForm.bgColor || '#667eea'};`;
    }
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (themeForm.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === themeForm.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(themeForm.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${themeForm.panelBlur ?? 8}px`;

  const localOverrideActive = localOverride !== null && localOverride !== '';
  const effectiveDesktopPos = localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50);
  const effectiveMobilePos = localOverrideActive ? localOverride : (themeForm.bgPositionMobile ?? 50);

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

  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      let finalUrl = themeForm.bgImageUrl;
      
      if (wallpaperFile) {
        const optimizedBlob = await compressImage(wallpaperFile, 1920, 1080, 0.85);
        finalUrl = await uploadToCloudflare(optimizedBlob, `app_background_${Date.now()}.jpg`);
      }

      await saveTheme({ ...themeForm, bgImageUrl: finalUrl });
      
      setWallpaperFile(null);
      const bgInput = document.getElementById('theme-bg-upload');
      if (bgInput) bgInput.value = '';

      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    } catch (e) {
      console.error("Failed to upload background:", e);
      alert("Failed to upload wallpaper");
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

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
        }
        @media (min-width: 768px) { body { background-position: center ${effectiveDesktopPos}%; } }
        @media (max-width: 767px) { body { background-position: ${effectiveMobilePos}% center; } }
        :root {
          --glass-panel-bg: ${panelRgba} !important;
          --glass-panel-blur: blur(${panelBlur}) !important;
          --theme-font-color: ${activeFontColor} !important;
        }
      `}</style>
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner">
        <button 
          onClick={() => setActiveTab('theme')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Palette className="w-4 h-4" /> App Theme
        </button>
        <button 
          onClick={() => setActiveTab('celebration')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'celebration' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Wand2 className="w-4 h-4" /> Celebration FX
        </button>
      </div>

      {/* Tab Content: APP THEME BUILDER */}
      {activeTab === 'theme' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
                Visual Customization
              </h3>
              <p className="text-slate-500 text-sm">Select presets or fully customize your family layout.</p>
            </div>
            
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preset Themes</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {THEME_PRESETS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setThemeForm({ ...themeForm, preset: p.id })}
                    className={`p-2 rounded-xl text-sm font-bold border-2 transition-all ${themeForm.preset === p.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-200'}`}
                    style={{ background: p.bg || '#e2e8f0', color: p.font }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isCustom && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Background Image</label>
                  <input 
                    id="theme-bg-upload"
                    type="file" accept="image/*" 
                    onChange={e => setWallpaperFile(e.target.files[0])} 
                    className="w-full p-2 border-2 border-white rounded-xl bg-white mb-2 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {(themeForm.bgImageUrl || wallpaperFile) && (
                     <button onClick={() => { 
                       setThemeForm({...themeForm, bgImageUrl: ''}); 
                       setWallpaperFile(null);
                       const el = document.getElementById('theme-bg-upload');
                       if(el) el.value = '';
                     }} className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1">
                       <X className="w-3 h-3" /> Remove Background
                     </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fallback Background Color</label>
                    <input type="color" value={themeForm.bgColor || '#667eea'} onChange={e => setThemeForm({ ...themeForm, bgColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calendar Font Color</label>
                    <input type="color" value={themeForm.fontColor || '#1f2937'} onChange={e => setThemeForm({ ...themeForm, fontColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="flex text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 items-center gap-1"><Type className="w-4 h-4"/> Global Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setThemeForm({ ...themeForm, fontFamily: f.id })}
                    className={`p-2 rounded-xl text-sm transition-all border-2 ${themeForm.fontFamily === f.id ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                    style={{ fontFamily: f.css }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Opacity</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelOpacity}%</span></div>
                <input type="range" min="10" max="100" step="5" value={themeForm.panelOpacity} onChange={(e) => setThemeForm({...themeForm, panelOpacity: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                <p className="text-xs text-slate-400 mt-1">Lower = More transparent</p>
              </div>
              <div>
                <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Glass Blur</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelBlur}px</span></div>
                <input type="range" min="0" max="24" step="2" value={themeForm.panelBlur} onChange={(e) => setThemeForm({...themeForm, panelBlur: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                <p className="text-xs text-slate-400 mt-1">Frosted effect to read text easily</p>
              </div>

              {(themeForm.bgImageUrl || wallpaperFile) && isCustom && (
                <>
                  <div>
                    <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Global Desktop Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionDesktop ?? 50}%</span></div>
                    <input type="range" min="0" max="100" value={themeForm.bgPositionDesktop ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionDesktop: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                  </div>
                  <div>
                    <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Global Mobile Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionMobile ?? 50}%</span></div>
                    <input type="range" min="0" max="100" value={themeForm.bgPositionMobile ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionMobile: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600">🖥️ Local Device Override</label>
                      {localOverrideActive && (
                        <button onClick={() => applyLocalOverride('')} className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-sm hover:bg-rose-100 transition-colors">✕ Clear Override</button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-4">Use this slider to adjust the vertical position <b>for this specific monitor only</b>. It writes directly to your browser's local storage and overrides the global position settings above.</p>
                    
                    <div className="flex justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Screen's Override Position</label>
                      <span className="text-xs font-bold text-emerald-600">{localOverrideActive ? localOverride + '%' : `Inactive`}</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50)} 
                      onChange={(e) => applyLocalOverride(e.target.value)} 
                      className={`w-full ${localOverrideActive ? 'accent-emerald-500' : 'accent-slate-300 opacity-60'}`}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={handleSaveTheme} 
                disabled={isSavingTheme || themeSaved}
                className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  themeSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSavingTheme ? <Loader2 className="w-5 h-5 animate-spin" /> : (themeSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingTheme ? 'Uploading & Saving...' : (themeSaved ? 'Theme Saved!' : 'Save App Theme')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content: CELEBRATION MIXER */}
      {activeTab === 'celebration' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
               Reward Popups
            </h3>
            <p className="text-slate-500 text-sm">Stack up to 4 effects for task completion celebrations.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-colors">
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={8}>8 Seconds (Long)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audio Track</label>
                <select value={celebForm.soundUrl} onChange={e => setCelebForm({ ...celebForm, soundUrl: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-colors">
                  <option value="">No Sound (Silent)</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3">Mario Level Complete</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3">Roblox Celebration</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3">Yoshi!</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({celebForm.layers?.length || 0}/4)</label>
              {(celebForm.layers || []).map((layer, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative shadow-sm">
                  <button onClick={() => removeLayer(index)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors bg-white p-1 rounded-md shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                  <div className="pr-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Effect Type</label>
                        <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                          {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Color Palette</label>
                        <select value={JSON.stringify(layer.colors)} onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                          {CELEB_PALETTES.map(pal => <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>)}
                        </select>
                        <div className="flex h-2 mt-1 rounded overflow-hidden">
                          {layer.colors.map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 mb-1">Particle Size</label><span className="text-xs font-bold text-indigo-500">{layer.scale}x</span></div>
                        <input type="range" min="0.5" max="3" step="0.1" value={layer.scale} onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-500"/>
                      </div>
                      <div>
                        <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 mb-1">Particle Amount</label><span className="text-xs font-bold text-indigo-500">{layer.intensity * 100}%</span></div>
                        <input type="range" min="0.2" max="2.5" step="0.1" value={layer.intensity} onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))} className="w-full accent-indigo-500"/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(celebForm.layers || []).length < 4 && (
                <button onClick={addLayer} className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-400 transition-colors">
                  <Plus className="w-5 h-5" /> Add Effect Layer
                </button>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button onClick={() => triggerCelebration(celebForm)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                <Play className="w-5 h-5 fill-current" /> Preview Blast
              </button>
              <button 
                onClick={handleSaveCeleb} 
                disabled={isSavingCeleb || celebSaved} 
                className={`flex-1 py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  celebSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isSavingCeleb ? <Loader2 className="w-5 h-5 animate-spin" /> : (celebSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingCeleb ? 'Saving...' : (celebSaved ? 'Effects Saved!' : 'Save Effects')}
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}