import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Monitor, Moon, VolumeX, Save, Sun, TabletSmartphone, CheckCircle2 } from 'lucide-react';
import { useKiosk } from '../../hooks/useKiosk';

export default function DeviceManagerTab() {
  const { isKioskDevice, toggleKioskMode } = useKiosk();
  
  const [config, setConfig] = useState({
    manualDim: false,
    manualMute: false,
    dimIntensity: 0.85,
    quietTimeEnabled: false,
    quietTimeStart: '20:00',
    quietTimeEnd: '07:00'
  });
  
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'kiosk'));
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await setDoc(doc(db, 'settings', 'kiosk'), config, { merge: true });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error("Error saving kiosk config:", error);
      alert(`Failed to save settings: ${error.message}`);
      setSaveState('idle');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading device settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Monitor className="text-indigo-600 w-6 h-6" /> Display & Devices
      </h3>

      {/* LOCAL DEVICE CONFIGURATION */}
      <div className="bg-sky-50 border-2 border-sky-200 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-sky-900 flex items-center gap-2">
              <TabletSmartphone className="w-5 h-5" /> Local Device Role
            </h4>
            <p className="text-xs text-sky-700 mt-1 max-w-sm">
              Enable this only on the wall-mounted calendar. If enabled, this specific screen will obey the auto-dimming and muting commands below.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={isKioskDevice}
              onChange={(e) => toggleKioskMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-sky-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Manual Overrides */}
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Push to all Kiosks</h4>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setConfig({ ...config, manualDim: !config.manualDim })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                config.manualDim ? 'bg-slate-800 border-slate-900 text-amber-300' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {config.manualDim ? <Moon className="w-8 h-8 mb-2" /> : <Sun className="w-8 h-8 mb-2" />}
              <span className="font-bold">{config.manualDim ? 'Force Dimmed' : 'Force Bright'}</span>
            </button>

            <button 
              onClick={() => setConfig({ ...config, manualMute: !config.manualMute })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                config.manualMute ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <VolumeX className="w-8 h-8 mb-2" />
              <span className="font-bold">{config.manualMute ? 'System Muted' : 'System Audio On'}</span>
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Quiet Time Scheduler */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Automated Quiet Time</h4>
              <p className="text-xs text-slate-500">Automatically dims Kiosk screens and mutes sounds during sleeping hours.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.quietTimeEnabled}
                onChange={(e) => setConfig({...config, quietTimeEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.quietTimeEnabled && (
            <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">Start Time (Dim)</label>
                <input 
                  type="time" 
                  value={config.quietTimeStart}
                  onChange={(e) => setConfig({...config, quietTimeStart: e.target.value})}
                  className="w-full p-2.5 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">End Time (Wake)</label>
                <input 
                  type="time" 
                  value={config.quietTimeEnd}
                  onChange={(e) => setConfig({...config, quietTimeEnd: e.target.value})}
                  className="w-full p-2.5 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Dim Intensity */}
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2">
            <span>Dimming Intensity</span>
            <span className="text-indigo-600">{Math.round(config.dimIntensity * 100)}% Blackout</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="0.95" 
            step="0.05"
            value={config.dimIntensity}
            onChange={(e) => setConfig({...config, dimIntensity: Number(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <p className="text-xs text-slate-400 mt-2">Adjust how dark Kiosk screens get when Dim Mode or Quiet Time is active.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
              saveState === 'saved' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-80`}
          >
            {saveState === 'saving' && 'Saving...'}
            {saveState === 'saved' && <><CheckCircle2 className="w-5 h-5" /> Saved!</>}
            {saveState === 'idle' && <><Save className="w-5 h-5" /> Save Kiosk Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}