import { useState, useEffect } from 'react';
import { Database, AlertTriangle, Trash2, CheckCircle2, Lock, Save, Music, PartyPopper } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { injectHistoricalData, removeTestData } from '../../utils/testDataHelpers';

const LEGACY_SOUNDS = [
  { name: '🍃 Animal Crossing NH', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Animal%20Crossing%20NH.mp3' },
  { name: '🐶 Bluey Hooray', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Bluey%20Bingo%20Hooray.mp3' },
  { name: '⚓ Bosun Whistle', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/BosunWhistle.mp3' },
  { name: '💵 Cash Register', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/CashRegister.mp3' },
  { name: '🚓 Chase is on the Case', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Chase%20is%20on%20the%20case.mp3' },
  { name: '🐦 Crow', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Crow%20.mp3' },
  { name: '🔔 Ding', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3' },
  { name: '🦆 Duck Hunt', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Duck%20hunt.mp3' },
  { name: '🚨 Fire Siren', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/FireSiren.mp3' },
  { name: '👻 Ghostbusters', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Ghostbusters%20.mp3' },
  { name: '🐐 Goat', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Goat.mp3' },
  { name: '🦉 Great Horned Owl', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Great%20Horned%20Owl.mp3' },
  { name: '💥 Laser Sound', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Laser%20Sound.mp3' },
  { name: '🍄 Mario Animal Crossing', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Animal%20Crossing.mp3' },
  { name: '🪙 Mario Coin', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Coin.mp3' },
  { name: '🍄 Mario Grow', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/MarioGrow.mp3' },
  { name: '🟩 Minecraft Level Up', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Minecraft%20level%20up%20sou.mp3' },
  { name: '🎮 Nintendo Switch', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Nintendo%20switch.mp3' },
  { name: '🐷 Peppa Pig', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Peppa.mp3' },
  { name: '⚡ Pikachu', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Picachu.mp3' },
  { name: '🏎️ Racing Car', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Racing%20car.mp3' },
  { name: '🟦 Roblox Celebration', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3' },
  { name: '🟦 Roblox Yay', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20yay.mp3' },
  { name: '🐐 Screaming Goat', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Screaming%20goat.mp3' },
  { name: '🤪 Slide Whistle', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Slide%20whistle.mp3' },
  { name: '🖖 TNG Door', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/TNG_Door.mp3' },
  { name: '🚂 Train Horn', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Train%20horn.mp3' },
  { name: '🤖 Wall-E WHOA', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Wall-E%20WHOA%20.mp3' },
  { name: '🚨 Yeeps Alarm', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Yeeps%20alarm.mp3' },
  { name: '🏁 Yeeps Round Start', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Yeeps%20round%20start.mp3' },
  { name: '🦖 Yoshi', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3' },
  { name: '🕰️ Vecna\'s Clock', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/VecnaClock.mp3' }
];

// Added some robust longer sounds for the celebrations!
const LEGACY_CELEB_SOUNDS = [
  { name: '🏁 Mario Flagpole', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3' },
  { name: '🥳 Roblox Fanfare', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3' }
];

export default function SystemToolsTab() {
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('8486');
  const [pinSaving, setPinSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'admin')).then(snap => {
      if (snap.exists() && snap.data().pin) setPin(snap.data().pin);
    });
  }, []);

  const handleSavePin = async () => {
    if (pin.length < 4) return alert("PIN must be at least 4 digits.");
    setPinSaving(true);
    await setDoc(doc(db, 'settings', 'admin'), { pin }, { merge: true });
    setPinSaving(false);
    alert("✅ Admin PIN updated successfully!");
  };

  const handleRestoreSounds = async () => {
    if (!window.confirm("Restore original library?")) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'sounds'), { items: LEGACY_SOUNDS }, { merge: true });
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: LEGACY_CELEB_SOUNDS }, { merge: true });
      alert("✅ Original sounds restored successfully!");
    } catch (e) {
      alert("❌ Failed to restore sounds.");
    }
    setLoading(false);
  };

  const handleInject = async () => {
    if (!window.confirm("Inject 60 days of fake chores?")) return;
    setLoading(true);
    await injectHistoricalData();
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!window.confirm("Permanently delete injected data?")) return;
    setLoading(true);
    await removeTestData();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Database className="text-indigo-600" /> System & Security Tools
      </h3>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-indigo-500" /> Change Admin PIN
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Used to access the Admin Panel and Quick-Add Chores. Keep this hidden from the kids!
          </p>
          <div className="flex gap-3 max-w-sm">
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} maxLength={8} className="flex-1 p-3 border-2 border-slate-200 rounded-xl font-bold text-center tracking-widest text-lg focus:outline-none focus:border-indigo-500" />
            <button onClick={handleSavePin} disabled={pinSaving} className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <PartyPopper className="w-5 h-5 text-indigo-500" /> Restore Legacy Sounds
          </h4>
          <p className="text-sm text-slate-500 mb-4">Click here to instantly restore your original sound effects to both the Short Sound and Celebration libraries.</p>
          <button onClick={handleRestoreSounds} disabled={loading} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-200 transition-colors shadow-sm">
            {loading ? 'Processing...' : 'Restore Sound Library'}
          </button>
        </div>

        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inject Historical Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">Populate the database with random chore completions for the past 60 days to test the bar charts.</p>
          <button onClick={handleInject} disabled={loading} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition-colors shadow-sm">
            {loading ? 'Processing...' : 'Inject Past 60 Days Data'}
          </button>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Remove Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">Surgically remove only the test data injected by the tool above.</p>
          <button onClick={handleRemove} disabled={loading} className="flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold hover:bg-rose-200 transition-colors shadow-sm">
            <Trash2 className="w-4 h-4" /> {loading ? 'Processing...' : 'Delete Test Data'}
          </button>
        </div>

      </div>
    </div>
  );
}