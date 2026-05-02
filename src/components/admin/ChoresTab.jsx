// src/components/admin/ChoresTab.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, CalendarDays, CheckSquare } from 'lucide-react';
import { db } from '../../config/firebase';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function ChoresTab() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const [isAdding, setIsAdding] = useState(false);
  
  const [newChore, setNewChore] = useState({ 
    name: '', 
    points: 10, 
    frequency: 'daily', 
    assignedTo: 'unassigned' 
  });

  // NEW: Allowance Settings State
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); // Default to Friday
  const [saving, setSaving] = useState(false);

  // NEW: Fetch Allowance Config
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => {
      if (docSnap.exists()) setAllowanceConfig(docSnap.data());
    });
    return () => unsub();
  }, []);

  // NEW: Save Allowance Config
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'allowance'), allowanceConfig);
    } catch (err) {
      console.error("Failed to save allowance config:", err);
    }
    setSaving(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newChore.name) return;
    
    // Generate a unique ID (e.g., "empty-dishwasher-4928")
    const id = newChore.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    try {
      // Atomic write to Firestore - prevents overwriting other chores!
      await setDoc(doc(db, 'chores', id), {
        ...newChore,
        points: parseInt(newChore.points) || 0,
        id
      });
      
      setNewChore({ name: '', points: 10, frequency: 'daily', assignedTo: 'unassigned' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding chore: ", error);
      alert("Failed to add chore to database.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this chore?")) {
      await deleteDoc(doc(db, 'chores', id));
    }
  };

  if (choresLoading || membersLoading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading data...</div>;

  // Helper to find member name for display
  const getMemberName = (id) => {
    if (id === 'unassigned') return '⭐ Bonus (Anyone)';
    const member = members.find(m => m.id === id);
    return member ? member.name : 'Unknown';
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* NEW: Allowance & Pay Day Settings */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <CalendarDays className="text-indigo-600" /> Allowance Settings
        </h3>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chore Pay Day</label>
            <select 
              value={allowanceConfig.payDay}
              onChange={(e) => setAllowanceConfig({ payDay: Number(e.target.value) })}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">This determines when payouts are highlighted in the kids' history charts.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              onClick={handleSaveConfig}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-slate-200"></div>

      {/* ORIGINAL: Header Area */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CheckSquare className="text-indigo-600" /> Chores Management
          </h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors shadow-sm ${
              isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Chore</>}
          </button>
        </div>

        {/* ORIGINAL: Add New Chore Form */}
        {isAdding && (
          <form onSubmit={handleAdd} className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
            <h4 className="font-bold text-amber-900">Add New Chore</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-1">Chore Name</label>
                <input type="text" value={newChore.name} onChange={e => setNewChore({...newChore, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Empty Dishwasher" required />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Points Value</label>
                <input type="number" min="0" value={newChore.points} onChange={e => setNewChore({...newChore, points: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition-colors" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Frequency</label>
                <select value={newChore.frequency} onChange={e => setNewChore({...newChore, frequency: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition-colors bg-white">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="today-only">📅 Today Only</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-1">Assign To</label>
                <select value={newChore.assignedTo} onChange={e => setNewChore({...newChore, assignedTo: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition-colors bg-white">
                  <option value="unassigned">⭐ Bonus (Anyone can claim)</option>
                  {members.filter(m => m.isKid).map(kid => (
                    <option key={kid.id} value={kid.id}>{kid.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button type="submit" className="mt-2 w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md">
              Save Chore to Database
            </button>
          </form>
        )}

        {/* ORIGINAL: The Chores List */}
        <div className="flex flex-col gap-3">
          {chores.map(chore => (
            <div key={chore.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-amber-100 transition-colors">
              <div>
                <div className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  {chore.name}
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">
                    {chore.points} pts
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                  <span className="capitalize">{chore.frequency}</span>
                  <span>•</span>
                  <span className={`${chore.assignedTo === 'unassigned' ? 'text-amber-500 font-bold' : ''}`}>
                    {getMemberName(chore.assignedTo)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => alert('Edit modal coming in next phase!')} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Chore">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(chore.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Chore">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {chores.length === 0 && !choresLoading && (
             <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-200 rounded-2xl">
               No chores found. Add some above!
             </div>
          )}
        </div>
      </section>
    </div>
  );
}