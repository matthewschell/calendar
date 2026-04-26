import { useState, useEffect } from 'react';
import { PartyPopper, Save, Play, Plus, Trash2 } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';

const PALETTES = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#d946ef'] },
  { id: 'gold', label: 'Gold & Silver', colors: ['#FFD700', '#FFA500', '#DAA520', '#F8F8FF', '#C0C0C0'] },
  { id: 'neon', label: 'Neon Cyber', colors: ['#FF1493', '#00FFFF', '#39FF14', '#FF00FF'] },
  { id: 'pastel', label: 'Spring Pastels', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
  { id: 'blizzard', label: 'Winter Blizzard', colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'] },
  { id: 'schell', label: 'Schell Family Colors', colors: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'] }
];

const EFFECTS = [
  { id: 'realistic-burst', label: '💥 Realistic Burst (Explode & Fall)' },
  { id: 'cannons', label: '🎉 Side Cannons' },
  { id: 'fireworks', label: '⭐ Giant Stars' },
  { id: 'rain', label: '🎊 Confetti Rain' },
  { id: 'snow', label: '❄️ Drifting Snow' },
  { id: 'center-burst', label: '🎇 Center Spinner' }
];

export default function ThemeTab() {
  const { settings, loading, saveSettings, triggerCelebration } = useCelebration();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  if (loading) return <div className="animate-pulse">Loading settings...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings(formData);
    setIsSaving(false);
  };

  const addLayer = () => {
    if ((formData.layers || []).length >= 4) return;
    setFormData(prev => ({
      ...prev,
      layers: [...(prev.layers || []), { type: 'realistic-burst', colors: PALETTES[0].colors, scale: 1, intensity: 1 }]
    }));
  };

  const updateLayer = (index, field, value) => {
    const newLayers = [...(formData.layers || [])];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setFormData(prev => ({ ...prev, layers: newLayers }));
  };

  const removeLayer = (index) => {
    const newLayers = [...(formData.layers || [])];
    newLayers.splice(index, 1);
    setFormData(prev => ({ ...prev, layers: newLayers }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
          <PartyPopper className="text-indigo-500" /> Advanced Celebration Mixer
        </h3>
        <p className="text-slate-500 text-sm">Stack up to 4 effects, customize their colors and size.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm space-y-6">
        
        {/* Global Settings */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b-2 border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
            <select 
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 font-bold text-slate-700"
            >
              <option value={3}>3 Seconds</option>
              <option value={5}>5 Seconds</option>
              <option value={8}>8 Seconds (Long)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audio Track</label>
            <select 
              value={formData.soundUrl}
              onChange={e => setFormData({ ...formData, soundUrl: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 font-bold text-slate-700"
            >
              <option value="">No Sound (Silent)</option>
              <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3">Mario Level Complete</option>
              <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3">Roblox Celebration</option>
              <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3">Yoshi!</option>
            </select>
          </div>
        </div>

        {/* Layers Mapping */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({formData.layers?.length || 0}/4)</label>
          
          {(formData.layers || []).map((layer, index) => (
            <div key={index} className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 relative">
              <button 
                onClick={() => removeLayer(index)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove Layer"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pr-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Type & Palette */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Effect Type</label>
                    <select 
                      value={layer.type} 
                      onChange={(e) => updateLayer(index, 'type', e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700"
                    >
                      {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Color Palette</label>
                    <select 
                      value={JSON.stringify(layer.colors)} 
                      onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700"
                    >
                      {PALETTES.map(pal => (
                        <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>
                      ))}
                    </select>
                    {/* Tiny Color Preview Bar */}
                    <div className="flex h-2 mt-1 rounded overflow-hidden">
                      {layer.colors.map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                    </div>
                  </div>
                </div>

                {/* Scale & Intensity */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Particle Size</label>
                      <span className="text-xs font-bold text-indigo-500">{layer.scale}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3" step="0.1" 
                      value={layer.scale} 
                      onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Particle Amount</label>
                      <span className="text-xs font-bold text-indigo-500">{layer.intensity * 100}%</span>
                    </div>
                    <input 
                      type="range" min="0.2" max="2.5" step="0.1" 
                      value={layer.intensity} 
                      onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}

          {(formData.layers || []).length < 4 && (
            <button 
              onClick={addLayer}
              className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-indigo-500 hover:border-indigo-300 transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Effect Layer
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button 
            onClick={() => triggerCelebration(formData)}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
          >
            <Play className="w-5 h-5 fill-current" /> Preview Blast
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}