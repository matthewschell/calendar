// src/components/admin/ChoresTab.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, CalendarDays, CheckSquare, X, Calculator, Settings } from 'lucide-react';
import { db } from '../../config/firebase';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import ChoreForecaster from './ChoreForecaster';

export default function ChoresTab() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  
  const [activeTab, setActiveTab] = useState('manage'); // 'manage', 'forecast', 'settings'
  
  const [isAdding, setIsAdding] = useState(false);
  const [newChore, setNewChore] = useState({ name: '', points: 10, frequency: 'daily', assignedTo: 'unassigned', days: [], startDate: '' });
  const [editingChore, setEditingChore] = useState(null);

  // Allowance Settings State
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); // Default to Friday
  const [saving, setSaving] = useState(false);

  // Fetch Allowance Config
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => {
      if (docSnap.exists()) setAllowanceConfig(docSnap.data());
    });
    return () => unsub();
  }, []);

  // Save Allowance Config
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
    
    try {
      const choreId = Date.now().toString();
      const choreData = {
        ...newChore,
        points: Number(newChore.points)
      };
      
      if (choreData.frequency === 'today-only') {
         choreData.createdDate = new Date().toDateString();
         choreData.todayOnly = true;
      }
      
      if (choreData.frequency !== 'weekly' && choreData.frequency !== 'bi-weekly') {
         choreData.days = null;
         choreData.startDate = null;
      }

      await setDoc(doc(db, 'chores', choreId), choreData);
      setIsAdding(false);
      setNewChore({ name: '', points: 10, frequency: 'daily', assignedTo: 'unassigned', days: [], startDate: '' });
    } catch (err) {
      console.error("Error adding chore:", err);
      alert("Failed to add chore");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingChore.name) return;
    
    try {
      const choreData = {
        ...editingChore,
        points: Number(editingChore.points)
      };

      if (choreData.frequency !== 'weekly' && choreData.frequency !== 'bi-weekly') {
         choreData.days = null;
         choreData.startDate = null;
      }

      await setDoc(doc(db, 'chores', editingChore.id), choreData, { merge: true });
      setEditingChore(null);
    } catch (err) {
      console.error("Error updating chore:", err);
      alert("Failed to update chore");
    }
  };

  const handleDelete = async (choreId) => {
    if (window.confirm("Archive this chore? It will be removed from daily lists but kept to protect past score history.")) {
      try {
        await setDoc(doc(db, 'chores', choreId), { 
          isArchived: true, 
          archivedDate: new Date().toISOString().slice(0, 10) 
        }, { merge: true });
      } catch (err) {
        console.error("Error archiving chore:", err);
        alert("Failed to archive chore.");
      }
    }
  };

  const toggleDay = (dayIndex, isEditing = false) => {
    if (isEditing) {
      const currentDays = editingChore.days || [];
      const newDays = currentDays.includes(dayIndex) 
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex];
      setEditingChore({ ...editingChore, days: newDays });
    } else {
      const currentDays = newChore.days || [];
      const newDays = currentDays.includes(dayIndex) 
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex];
      setNewChore({ ...newChore, days: newDays });
    }
  };

  if (choresLoading || membersLoading) return <div className="p-4 animate-pulse font-medium text-slate-500">Loading chores...</div>;

  const kids = members.filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true');
  const activeChores = chores.filter(c => !c.isArchived);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner overflow-x-auto">
        <button 
          onClick={() => setActiveTab('manage')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <CheckSquare className="w-4 h-4" /> Manage Chores
        </button>
        <button 
          onClick={() => setActiveTab('forecast')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'forecast' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Calculator className="w-4 h-4" /> Forecaster Matrix
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Settings className="w-4 h-4" /> Allowance Settings
        </button>
      </div>

      {/* Tab Content: Forecast */}
      {activeTab === 'forecast' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ChoreForecaster />
        </div>
      )}

      {/* Tab Content: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-lg">Weekly Allowance Target</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Select the day of the week your family distributes allowance. This helps the kid dashboards highlight when pay day is arriving.</p>
          
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weekly Pay Day</label>
              <select 
                value={allowanceConfig.payDay} 
                onChange={(e) => setAllowanceConfig({ ...allowanceConfig, payDay: Number(e.target.value) })}
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
            </div>
            <button 
              onClick={handleSaveConfig}
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 h-[50px] shadow-sm"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Manage */}
      {activeTab === 'manage' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
              Active Task List
            </h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Chore</>}
            </button>
          </div>

          {isAdding && (
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
              <h4 className="font-bold text-indigo-900 mb-4">Create New Chore</h4>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                    <input required type="text" value={newChore.name} onChange={e => setNewChore({...newChore, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" placeholder="e.g. Empty Dishwasher" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points Value</label>
                    <input required type="number" min="0" value={newChore.points} onChange={e => setNewChore({...newChore, points: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                    <select value={newChore.assignedTo} onChange={e => setNewChore({...newChore, assignedTo: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500">
                      <option value="unassigned">⭐ Bonus / Anyone</option>
                      {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                    <select value={newChore.frequency} onChange={e => setNewChore({...newChore, frequency: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="today-only">📅 Today Only</option>
                    </select>
                  </div>
                </div>

                {(newChore.frequency === 'weekly' || newChore.frequency === 'bi-weekly') && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Days</label>
                    <div className="flex gap-2">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                        <button type="button" key={i} onClick={() => toggleDay(i)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${newChore.days?.includes(i) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {newChore.frequency === 'bi-weekly' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Starting Week Of (Anchor Date)</label>
                    <input type="date" required value={newChore.startDate} onChange={e => setNewChore({...newChore, startDate: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                  Save New Chore
                </button>
              </form>
            </div>
          )}

          {/* Group Chores by Kid */}
          <div className="space-y-4">
            {[...kids, { id: 'unassigned', name: '⭐ Bonus Chores', color: '#f59e0b' }].map(assignee => {
              const assigneeChores = activeChores.filter(c => c.assignedTo === assignee.id || (!c.assignedTo && assignee.id === 'unassigned')).sort((a, b) => a.name.localeCompare(b.name));
              
              if (assigneeChores.length === 0) return null;

              return (
                <div key={assignee.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: `${assignee.color}15` }}>
                    <h4 className="font-bold text-lg" style={{ color: assignee.color }}>{assignee.name}</h4>
                    <span className="text-xs font-bold opacity-60" style={{ color: assignee.color }}>{assigneeChores.length} Assigned</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {assigneeChores.map(chore => (
                      <div key={chore.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {chore.name}
                            {chore.frequency === 'today-only' && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md uppercase tracking-wider">Today Only</span>}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-1">
                            {chore.points} points • {chore.frequency.replace('-', ' ')}
                            {(chore.frequency === 'weekly' || chore.frequency === 'bi-weekly') && chore.days && ` (${chore.days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')})`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingChore(chore)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(chore.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingChore && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[1100]" onClick={() => setEditingChore(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Edit Chore</h3>
              <button onClick={() => setEditingChore(null)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                <input required type="text" value={editingChore.name} onChange={e => setEditingChore({...editingChore, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points</label>
                  <input required type="number" min="0" value={editingChore.points} onChange={e => setEditingChore({...editingChore, points: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                  <select value={editingChore.assignedTo} onChange={e => setEditingChore({...editingChore, assignedTo: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500">
                    <option value="unassigned">⭐ Bonus / Anyone</option>
                    {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                <select value={editingChore.frequency} onChange={e => setEditingChore({...editingChore, frequency: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                </select>
              </div>

              {(editingChore.frequency === 'weekly' || editingChore.frequency === 'bi-weekly') && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Days</label>
                  <div className="flex gap-1.5">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                      <button type="button" key={i} onClick={() => toggleDay(i, true)} className={`flex-1 py-2 rounded-lg font-bold text-[11px] uppercase transition-colors border ${editingChore.days?.includes(i) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editingChore.frequency === 'bi-weekly' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Starting Week Of (Anchor Date)</label>
                  <input type="date" required value={editingChore.startDate || ''} onChange={e => setEditingChore({...editingChore, startDate: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}