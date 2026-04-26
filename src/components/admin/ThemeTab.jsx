import { useState, useEffect } from 'react';
import { PartyPopper, Save, Play, CheckCircle2 } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';

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

  const toggleEffect = (effectKey) => {
    setFormData(prev => ({ ...prev, [effectKey]: !prev[effectKey] }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
          <PartyPopper className="text-indigo-500" /> Celebration Engine
        </h3>
        <p className="text-slate-500 text-sm">Stack multiple effects together to create the ultimate chore completion sequence.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm space-y-6">
        
        {/* Effect Layers (Multi-Select) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Effect Layers (Stackable)</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <button
              onClick={() => toggleEffect('cannons')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm relative ${
                formData.cannons ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {formData.cannons && <CheckCircle2 className="w-5 h-5 absolute top-2 right-2 text-indigo-500" />}
              <span className="text-3xl">🎉</span>
              Side Cannons
            </button>

            <button
              onClick={() => toggleEffect('fireworks')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm relative ${
                formData.fireworks ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {formData.fireworks && <CheckCircle2 className="w-5 h-5 absolute top-2 right-2 text-amber-500" />}
              <span className="text-3xl">⭐</span>
              Giant Stars
            </button>

            <button
              onClick={() => toggleEffect('rain')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm relative ${
                formData.rain ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {formData.rain && <CheckCircle2 className="w-5 h-5 absolute top-2 right-2 text-sky-500" />}
              <span className="text-3xl">🎊</span>
              Confetti Rain
            </button>

          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
          <select 
            value={formData.duration}
            onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
            className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-medium text-slate-700"
          >
            <option value={3}>3 Seconds (Quick Pop)</option>
            <option value={5}>5 Seconds (Standard)</option>
            <option value={10}>10 Seconds (Epic)</option>
          </select>
        </div>

        {/* Sound Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Victory Sound</label>
          <select 
            value={formData.soundUrl}
            onChange={e => setFormData({ ...formData, soundUrl: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-medium text-slate-700"
          >
            <option value="">No Sound (Silent)</option>
            <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3">Mario Level Complete</option>
            <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3">Roblox Celebration</option>
            <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3">Yoshi!</option>
          </select>
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
            <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}