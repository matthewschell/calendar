// src/components/admin/WidgetsTab.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Lightbulb, Trophy, CloudSun, Save } from 'lucide-react';
import MessageTab from './MessageTab';
import FactsTab from './FactsTab';

function LeaderboardSettings() {
  const [config, setConfig] = useState({
    enabledTimeframes: ['daily', 'weekly', 'lifetime'],
    defaultTimeframe: 'daily',
    autoRevertSeconds: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'leaderboard');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'leaderboard'), config);
    } catch (error) {
      console.error("Error saving leaderboard settings:", error);
      alert("Failed to save settings.");
    }
    setSaving(false);
  };

  const toggleTimeframe = (tf) => {
    setConfig(prev => {
      const enabled = prev.enabledTimeframes.includes(tf)
        ? prev.enabledTimeframes.filter(t => t !== tf)
        : [...prev.enabledTimeframes, tf];
      
      // If the user unchecks the current default, smartly select a new default
      let newDefault = prev.defaultTimeframe;
      if (!enabled.includes(newDefault) && enabled.length > 0) {
        newDefault = enabled[0];
      }

      return { ...prev, enabledTimeframes: enabled, defaultTimeframe: newDefault };
    });
  };

  if (loading) return <div className="p-4 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Trophy className="text-indigo-600" /> Leaderboard Settings
      </h3>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">Enabled Leaderboard Views</label>
          <div className="flex flex-wrap gap-4">
            {['daily', 'weekly', 'monthly', 'lifetime'].map(tf => (
              <label key={tf} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.enabledTimeframes.includes(tf)}
                  onChange={() => toggleTimeframe(tf)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="capitalize font-semibold text-slate-700">{tf}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Default View</label>
          <select 
            value={config.defaultTimeframe}
            onChange={(e) => setConfig({...config, defaultTimeframe: e.target.value})}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 capitalize focus:outline-none focus:border-indigo-500"
          >
            {config.enabledTimeframes.map(tf => (
              <option key={tf} value={tf} className="capitalize">{tf}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">This is the view it will automatically revert back to.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Auto-Revert Timer (Seconds)</label>
          <input 
            type="number" 
            min="10"
            max="300"
            value={config.autoRevertSeconds}
            onChange={(e) => setConfig({...config, autoRevertSeconds: Number(e.target.value)})}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-2">How long a user can view an alternate leaderboard before it snaps back to default.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WidgetsTab() {
  const [activeSubTab, setActiveSubTab] = useState('leaderboard');

  return (
    <div className="flex flex-col h-full gap-5">
      {/* Widget Sub-Navigation */}
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl shrink-0 overflow-x-auto hide-scrollbar">
        <SubTabButton active={activeSubTab === 'leaderboard'} onClick={() => setActiveSubTab('leaderboard')} icon={<Trophy className="w-4 h-4"/>} label="Leaderboard" />
        <SubTabButton active={activeSubTab === 'messages'} onClick={() => setActiveSubTab('messages')} icon={<MessageSquare className="w-4 h-4"/>} label="Message Centre" />
        <SubTabButton active={activeSubTab === 'facts'} onClick={() => setActiveSubTab('facts')} icon={<Lightbulb className="w-4 h-4"/>} label="Facts & Jokes" />
        <SubTabButton active={activeSubTab === 'weather'} onClick={() => setActiveSubTab('weather')} icon={<CloudSun className="w-4 h-4"/>} label="Weather" />
      </div>

      {/* Widget Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeSubTab === 'leaderboard' && <LeaderboardSettings />}
        {activeSubTab === 'messages' && <MessageTab />}
        {activeSubTab === 'facts' && <FactsTab />}
        {activeSubTab === 'weather' && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <CloudSun className="w-16 h-16 mb-4 opacity-30" />
            <p className="font-bold text-lg">Weather Widget</p>
            <p className="text-sm">Coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubTabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex-1 flex min-w-max items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
        active ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
    >
      {icon}{label}
    </button>
  );
}