// src/components/admin/WidgetsTab.jsx
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Lightbulb, Trophy, CloudSun, Save, MapPin, Sparkles, Search } from 'lucide-react';
import MessageTab from './MessageTab';
import FactsTab from './FactsTab';

function LeaderboardSettings() {
  const [config, setConfig] = useState({
    enabledTimeframes: ['daily', 'weekly', 'yearly', 'lifetime'],
    defaultTimeframe: 'daily',
    autoRevertSeconds: 60
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
            {['daily', 'weekly', 'monthly', 'yearly', 'lifetime'].map(tf => (
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
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50">
            <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WeatherSettings() {
  const [config, setConfig] = useState({
    city: 'Whitby, ON',
    lat: 43.8975,
    lon: -78.9429,
    units: 'celsius',
    displayMode: 'daily',
    kidFriendly: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'weather');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;
    setIsSearching(true);
    
    const cleanSearchTerm = citySearch.split(',')[0].trim();
    
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanSearchTerm)}&count=10&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCity = (city) => {
    const stateOrCountry = city.admin1 || city.country || '';
    setConfig({
      ...config,
      city: `${city.name}${stateOrCountry ? `, ${stateOrCountry}` : ''}`,
      lat: Number(city.latitude.toFixed(4)),
      lon: Number(city.longitude.toFixed(4))
    });
    setSearchResults([]);
    setCitySearch('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'weather'), config);
    } catch (error) {
      console.error("Error saving weather settings:", error);
      alert("Failed to save settings.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-4 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <CloudSun className="text-indigo-600" /> Weather Settings
      </h3>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Location Block */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" /> Set Location
          </h4>
          
          <form onSubmit={handleSearchCity} className="flex gap-2 mb-4 relative">
            <input 
              type="text" 
              placeholder="Search for a city (e.g. Whitby)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="flex-1 p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" disabled={isSearching} className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Search className="w-4 h-4" /> {isSearching ? '...' : 'Search'}
            </button>
            
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    onClick={() => selectCity(result)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <div className="font-bold text-slate-800">{result.name}</div>
                    <div className="text-xs text-slate-500">{result.admin1 ? `${result.admin1}, ` : ''}{result.country}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Current Widget Location</div>
              <div className="font-bold text-indigo-900 text-lg">{config.city}</div>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Lat: {config.lat}</div>
              <div>Lon: {config.lon}</div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default View</label>
            <select 
              value={config.displayMode}
              onChange={(e) => setConfig({...config, displayMode: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="daily">7-Day Forecast</option>
              <option value="hourly">Hourly Forecast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Temperature Units</label>
            <select 
              value={config.units}
              onChange={(e) => setConfig({...config, units: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>

        {/* Kid Friendly Toggle - FIXED TAILWIND BRACKETS */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Kid-Friendly Smart Advice
            </h4>
            <p className="text-xs text-amber-700 mt-1">Shows bold, helpful hints (like 🧥 for cold, ☂️ for rain) right on the widget.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.kidFriendly}
              onChange={(e) => setConfig({...config, kidFriendly: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
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
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl shrink-0 overflow-x-auto hide-scrollbar">
        <SubTabButton active={activeSubTab === 'leaderboard'} onClick={() => setActiveSubTab('leaderboard')} icon={<Trophy className="w-4 h-4"/>} label="Leaderboard" />
        <SubTabButton active={activeSubTab === 'messages'} onClick={() => setActiveSubTab('messages')} icon={<MessageSquare className="w-4 h-4"/>} label="Message Centre" />
        <SubTabButton active={activeSubTab === 'facts'} onClick={() => setActiveSubTab('facts')} icon={<Lightbulb className="w-4 h-4"/>} label="Facts & Jokes" />
        <SubTabButton active={activeSubTab === 'weather'} onClick={() => setActiveSubTab('weather')} icon={<CloudSun className="w-4 h-4"/>} label="Weather" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeSubTab === 'leaderboard' && <LeaderboardSettings />}
        {activeSubTab === 'messages' && <MessageTab />}
        {activeSubTab === 'facts' && <FactsTab />}
        {activeSubTab === 'weather' && <WeatherSettings />}
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