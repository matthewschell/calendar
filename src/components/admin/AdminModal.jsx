import { useState } from 'react';
import { X, Settings, Users, ClipboardList, Palette, Database } from 'lucide-react';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

import FamilyMembersTab from './FamilyMembersTab';
import ChoresTab from './ChoresTab';

const ADMIN_PIN = "8486";

export default function AdminModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('members');
  const [isMigrating, setIsMigrating] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPin('');
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  // The Temporary Migration Function
  const handleMigrateFacts = async () => {
    if (!confirm("This will push all facts from your local JSON into Firestore. Ready?")) return;
    
    setIsMigrating(true);
    try {
      const batch = writeBatch(db);
      const dailyRef = collection(db, 'dailyContent');

      factsData.forEach((item) => {
        if (item.startsWith('[')) {
          // Extract the date like "01-01" from "[01-01] <b>🎆 Happy..."
          const dateMatch = item.match(/\[(\d{2}-\d{2})\]/);
          if (dateMatch) {
            const dateId = dateMatch[1]; 
            const text = item.replace(`[${dateId}]`, '').trim();
            
            // Set document ID explicitly to the date (e.g., "04-25")
            const docRef = doc(dailyRef, dateId);
            batch.set(docRef, { type: 'override', text, date: dateId });
          }
        } else {
          // It's a standard random fact, let Firestore auto-generate the ID
          const docRef = doc(dailyRef); 
          batch.set(docRef, { type: 'fact', text: item });
        }
      });

      await batch.commit();
      alert("✅ Migration complete! 100+ facts and events are now in the cloud.");
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Failed to migrate data. Check console.");
    } finally {
      setIsMigrating(false);
    }
  };

  // The PIN Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin Access</h3>
          <p className="text-slate-500 mb-6">Enter PIN to access settings</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              autoFocus
              className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="••••"
            />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Unlock
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // The Main Admin Dashboard
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-indigo-600" /> Admin Panel
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2 shrink-0">
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users className="w-5 h-5" />} label="Family Members" />
            <TabButton active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} icon={<ClipboardList className="w-5 h-5" />} label="Chores & Points" />
            <TabButton active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} icon={<Palette className="w-5 h-5" />} label="Theme & Display" />
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Database className="w-5 h-5" />} label="Database Tools" />
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'members' && <FamilyMembersTab />}
            {activeTab === 'chores' && <ChoresTab />}
            
            {activeTab === 'theme' && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">🎨 Theme Customization</h3>
                <p className="text-slate-500">Theme component goes here.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">🔧 Database Tools</h3>
                
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm mt-4">
                  <h4 className="font-bold text-slate-800 mb-2">Migrate Local Facts to Firestore</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Push your local facts.json file into the cloud database. You only need to run this once.
                  </p>
                  <button 
                    onClick={handleMigrateFacts}
                    disabled={isMigrating}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isMigrating ? 'Migrating Data...' : 'Run Migration Script'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all w-full text-left ${
        active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}