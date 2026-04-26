import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Star, Lightbulb, Edit2, X, Save } from 'lucide-react';
import { db } from '../../config/firebase';

export default function FactsTab() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'fact', text: '', date: '' });
  
  // State for the Edit Modal
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'dailyContent'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContent(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.text) return;

    try {
      if (newItem.type === 'override') {
        if (!newItem.date) return alert('Please enter a date for the special event.');
        // Parse "YYYY-MM-DD" from the date picker into "MM-DD"
        const [, month, day] = newItem.date.split('-');
        const dateId = `${month}-${day}`;
        
        await setDoc(doc(db, 'dailyContent', dateId), {
          type: 'override',
          text: newItem.text,
          date: dateId
        });
      } else {
        // Standard fact, auto-generate ID
        await setDoc(doc(collection(db, 'dailyContent')), {
          type: 'fact',
          text: newItem.text
        });
      }
      setNewItem({ type: 'fact', text: '', date: '' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to save. Are you offline?");
    }
  };

  const handleDelete = async (id, type) => {
    if (confirm(`Delete this ${type === 'override' ? 'special event' : 'fact'}?`)) {
      await deleteDoc(doc(db, 'dailyContent', id));
    }
  };

  const openEditModal = (item) => {
    setEditingItem({
      ...item,
      // Provide a dummy leap year (2024) so Feb 29th works flawlessly in the date picker!
      editDate: item.type === 'override' ? `2024-${item.date}` : ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem.type === 'fact') {
        await updateDoc(doc(db, 'dailyContent', editingItem.id), {
          text: editingItem.text
        });
      } else {
        // Handle override changes (where the ID relies on the date)
        const [, month, day] = editingItem.editDate.split('-');
        const newDateId = `${month}-${day}`;
        
        if (newDateId !== editingItem.id) {
          // If the date changed, we must delete the old document and create a new one
          await deleteDoc(doc(db, 'dailyContent', editingItem.id));
          await setDoc(doc(db, 'dailyContent', newDateId), {
            type: 'override',
            text: editingItem.text,
            date: newDateId
          });
        } else {
          // If the date stayed the same, just update the text
          await updateDoc(doc(db, 'dailyContent', editingItem.id), {
            text: editingItem.text
          });
        }
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update content.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading database...</div>;

  const overrides = content.filter(c => c.type === 'override').sort((a, b) => a.date.localeCompare(b.date));
  const facts = content.filter(c => c.type === 'fact');

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">💡 Facts & Events Manager</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Content</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-bold text-indigo-900">Add New Content</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Content Type</label>
              <select 
                value={newItem.type} 
                onChange={e => setNewItem({...newItem, type: e.target.value})} 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="fact">Random Daily Fact</option>
                <option value="override">⭐ Special Day / Birthday</option>
              </select>
            </div>

            {newItem.type === 'override' && (
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Date (Year is ignored)</label>
                <input 
                  type="date" 
                  value={newItem.date} 
                  onChange={e => setNewItem({...newItem, date: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white" 
                  required 
                />
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-600 mb-1">Message / Fact Text</label>
              <p className="text-xs text-slate-500 mb-2">You can use basic HTML like &lt;b&gt;bold&lt;/b&gt; or &lt;br&gt; for line breaks.</p>
              <textarea 
                value={newItem.text} 
                onChange={e => setNewItem({...newItem, text: e.target.value})} 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 min-h-24" 
                placeholder={newItem.type === 'override' ? "<b>🎉 Happy Birthday!</b> <br><br> Did you know..." : "Honey never spoils!"}
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="mt-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md">
            Save to Database
          </button>
        </form>
      )}

      {/* Overrides Section */}
      <div>
        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> Special Days & Birthdays ({overrides.length})
        </h4>
        <div className="flex flex-col gap-2">
          {overrides.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2 py-1 rounded-md shrink-0">{item.date}</span>
                <span className="text-sm text-slate-700 wrap-break-word" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
              <div className="flex gap-1 shrink-0 pl-2">
                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id, 'override')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {overrides.length === 0 && <span className="text-sm text-slate-400 italic px-2">No special days added yet.</span>}
        </div>
      </div>

      {/* Facts Section */}
      <div className="mt-4">
        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-500" /> General Facts ({facts.length})
        </h4>
        <div className="flex flex-col gap-2">
          {facts.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
              <span className="text-sm text-slate-700 wrap-break-word pr-4" dangerouslySetInnerHTML={{ __html: item.text }} />
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id, 'fact')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {facts.length === 0 && <span className="text-sm text-slate-400 italic px-2">No facts added yet.</span>}
        </div>
      </div>

      {/* Edit Modal (Teleported to root) */}
      {editingItem && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
          style={{ zIndex: 1100 }}
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" /> 
                Edit {editingItem.type === 'override' ? 'Special Day' : 'Fact'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              {editingItem.type === 'override' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={editingItem.editDate} 
                    onChange={e => setEditingItem({...editingItem, editDate: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 bg-slate-50 font-medium" 
                    required 
                  />
                  <p className="text-xs text-slate-500 mt-1">Year is ignored. Date locks to Month-Day.</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Message / Fact Text</label>
                <textarea 
                  value={editingItem.text} 
                  onChange={e => setEditingItem({...editingItem, text: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 min-h-37.5 font-medium" 
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}