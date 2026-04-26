import { useState } from 'react';
import { X, Settings, Users, ClipboardList, Palette, Lightbulb, Database, MessageSquare } from 'lucide-react';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../../config/firebase';
import ThemeTab from './ThemeTab';

import FamilyMembersTab from './FamilyMembersTab';
import ChoresTab from './ChoresTab';
import FactsTab from './FactsTab';
import MessageTab from './MessageTab';

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

  // Legacy Events Migration Function
  const handleMigrateLegacyEvents = async () => {
    if (!window.confirm("This will pull all your legacy events from the old Realtime Database and push them to the new Firestore database. Ready?")) return;
    
    setIsMigrating(true);
    try {
      // 1. Connect to your old Realtime Database
      const rtdb = getDatabase();
      const legacyRef = ref(rtdb, 'schellFamilyCalendar/events');
      const snapshot = await get(legacyRef);
      
      if (snapshot.exists()) {
        const legacyEvents = snapshot.val();
        
        // 2. Prepare the new Firestore batch write
        const batch = writeBatch(db);
        const eventsCollection = collection(db, 'calendarEvents');
        
        let count = 0;
        legacyEvents.forEach(event => {
          if (!event) return;
          
          // Use the existing ID if possible so we don't duplicate on multiple runs
          const newDocRef = event.id ? doc(eventsCollection, String(event.id)) : doc(eventsCollection);
          
          batch.set(newDocRef, {
            groupId: event.groupId || null,
            title: event.title || 'Untitled',
            date: event.date || '',
            member: Array.isArray(event.member) ? event.member : (event.member ? [event.member] : []),
            time: event.time || '',
            endTime: event.endTime || '',
            isMultiDay: event.isMultiDay || false,
            startDate: event.startDate || '',
            endDate: event.endDate || ''
          });
          count++;
        });
        
        await batch.commit();
        alert(`✅ Migration complete! ${count} legacy events have been successfully migrated to Firestore.`);
      } else {
        alert("No legacy events found in the old database.");
      }
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Failed to migrate events. Check your browser console for details.");
    } finally {
      setIsMigrating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin Access</h3>
          <p className="text-slate-500 mb-6">Enter PIN to access settings</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              autoComplete="new-password"
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
            <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare className="w-5 h-5" />} label="Message Centre" />
            <TabButton active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} icon={<Palette className="w-5 h-5" />} label="Theme & Display" />
            <TabButton active={activeTab === 'facts'} onClick={() => setActiveTab('facts')} icon={<Lightbulb className="w-5 h-5" />} label="Facts & Events" />
            <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Database className="w-5 h-5" />} label="System Tools" />
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'members' && <FamilyMembersTab />}
            {activeTab === 'chores' && <ChoresTab />}
            {activeTab === 'messages' && <MessageTab />}
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'facts' && <FactsTab />}

            {activeTab === 'system' && (
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">🔧 System Tools</h3>
                
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm mt-4">
                  <h4 className="font-bold text-slate-800 mb-2">Migrate Legacy Calendar Events</h4>
                  <p className="text-sm text-slate-500 mb-4">
                    Pull your old events from the Firebase Realtime Database and push them into the new Firestore system.
                  </p>
                  <button 
                    onClick={handleMigrateLegacyEvents}
                    disabled={isMigrating}
                    className="py-2 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isMigrating ? 'Migrating Events...' : 'Run Event Migration Script'}
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