import { useState, useEffect } from 'react';
import { PartyPopper, Save, Play } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';

export default function ThemeTab() {
  const { settings, loading, saveSettings, triggerCelebration } = useCelebration();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when database loads
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  if (loading) return <div className="animate-pulse">Loading settings...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    await saveSettings(formData);
    setIsSaving(false);
  };

  const handlePreview = () => {
    // Pass the current unsaved form data directly to the trigger to test it!
    triggerCelebration(formData);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
          <PartyPopper className="text-indigo-500" /> Celebration Editor
        </h3>
        <p className="text-slate-500 text-sm">Customize what happens when the kids finish all their chores.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm space-y-6">
        
        {/* Style Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Confetti Style</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'cannons', label: 'Side Cannons', emoji: '🎉' },
              { id: 'fireworks', label: 'Fireworks', emoji: '🎆' },
              { id: 'stars', label: 'Shooting Stars', emoji: '⭐' },
              { id: 'rain', label: 'Confetti Rain', emoji: '🎊' }
            ].map(style => (
              <button
                key={style.id}
                onClick={() => setFormData({ ...formData, style: style.id })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-sm ${
                  formData.style === style.id 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{style.emoji}</span>
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity & Duration */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Intensity</label>
            <select 
              value={formData.intensity}
              onChange={e => setFormData({ ...formData, intensity: Number(e.target.value) })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value={50}>Light & Breezy</option>
              <option value={100}>Standard Blast</option>
              <option value={250}>Absolute Mayhem</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
            <select 
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value={3}>3 Seconds</option>
              <option value={5}>5 Seconds</option>
              <option value={10}>10 Seconds (Epic)</option>
            </select>
          </div>
        </div>

        {/* Sound Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Victory Sound</label>
          <p className="text-xs text-slate-400 mb-3">
            To use these, drop your custom MP3 files into your project's <code className="bg-slate-100 px-1 rounded">public/sounds</code> folder.
          </p>
          <select 
            value={formData.soundUrl}
            onChange={e => setFormData({ ...formData, soundUrl: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">No Sound (Silent)</option>
            <option value="/sounds/mario.mp3">Mario Level Up (mario.mp3)</option>
            <option value="/sounds/tada.mp3">Classic Tada (tada.mp3)</option>
            <option value="/sounds/applause.mp3">Applause (applause.mp3)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button 
            onClick={handlePreview}
            className="flex-1 py-3 bg-amber-100 text-amber-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors"
          >
            <Play className="w-5 h-5 fill-current" /> Preview Effect
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