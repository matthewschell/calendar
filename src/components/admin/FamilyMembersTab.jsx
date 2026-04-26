import { useState, useRef } from 'react';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserPlus, Trash2, Edit2, Save, X, Play, Image as ImageIcon, DollarSign } from 'lucide-react';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

// Map the dropdown values to actual audio files for the preview button
const SOUND_FILES = {
  'mario-coin': '/sounds/mario-coin.mp3',
  'level-up': '/sounds/level-up.mp3',
  'fairy-chimes': '/sounds/fairy-chimes.mp3',
  'victory-fanfare': 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3',
  'arcade-coin': '/sounds/arcade-coin.mp3'
};

export default function FamilyMembersTab() {
  const { members, loading } = useFamilyMembers();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const audioRef = useRef(null);
  
  const [newMember, setNewMember] = useState({ 
    name: '', 
    color: '#3B82F6', 
    isKid: true, 
    signatureSound: 'mario-coin',
    avatar: '',
    payRate: 0.10
  });

  const playPreview = (soundKey) => {
    const url = SOUND_FILES[soundKey];
    if (!url) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(e => console.log("Audio play blocked or file missing:", e));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    
    const id = newMember.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    try {
      await setDoc(doc(db, 'familyMembers', id), {
        ...newMember,
        id,
        points: 0 
      });
      
      setNewMember({ name: '', color: '#3B82F6', isKid: true, signatureSound: 'mario-coin', avatar: '', payRate: 0.10 });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding member: ", error);
      alert("Failed to add member to database.");
    }
  };

  const startEditing = (member) => {
    setEditingId(member.id);
    setEditForm({ 
      ...member,
      payRate: member.payRate || 0.10,
      avatar: member.avatar || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, 'familyMembers', editingId), {
        name: editForm.name,
        color: editForm.color,
        isKid: editForm.isKid,
        signatureSound: editForm.signatureSound,
        avatar: editForm.avatar,
        payRate: Number(editForm.payRate)
      });
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error("Error updating member: ", error);
      alert("Failed to update member.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this family member? Their past history will remain safe.")) {
      await deleteDoc(doc(db, 'familyMembers', id));
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading members...</div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">👨‍👩‍👧‍👦 Family Members</h3>
        <button 
          onClick={() => { setIsAdding(!isAdding); cancelEditing(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          {isAdding ? 'Cancel' : <><UserPlus className="w-5 h-5" /> Add Member</>}
        </button>
      </div>

      {/* Add New Member Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-bold text-indigo-900">Add New Member</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Name</label>
              <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="e.g. Mason" required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Type</label>
              <select value={newMember.isKid} onChange={e => setNewMember({...newMember, isKid: e.target.value === 'true'})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors bg-white">
                <option value="true">Kid</option>
                <option value="false">Adult</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Profile Color</label>
              <div className="flex gap-3">
                <input type="color" value={newMember.color} onChange={e => setNewMember({...newMember, color: e.target.value})} className="h-12 w-12 rounded-xl cursor-pointer border-0 p-0" />
                <input type="text" value={newMember.color} onChange={e => setNewMember({...newMember, color: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 uppercase transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Avatar Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input type="url" value={newMember.avatar} onChange={e => setNewMember({...newMember, avatar: e.target.value})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" placeholder="https://..." />
              </div>
            </div>
            
            {newMember.isKid && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Signature Sound</label>
                  <div className="flex gap-2">
                    <select value={newMember.signatureSound} onChange={e => setNewMember({...newMember, signatureSound: e.target.value})} className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors bg-white">
                      <option value="mario-coin">🪙 Mario Coin</option>
                      <option value="level-up">🟩 Level Up</option>
                      <option value="fairy-chimes">✨ Fairy Chimes</option>
                      <option value="victory-fanfare">🎺 Victory Fanfare</option>
                      <option value="arcade-coin">🕹️ Arcade Coin</option>
                    </select>
                    <button type="button" onClick={() => playPreview(newMember.signatureSound)} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-indigo-600 transition-colors">
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Pay Rate (Per Point)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="number" step="0.01" min="0" value={newMember.payRate} onChange={e => setNewMember({...newMember, payRate: parseFloat(e.target.value)})} className="w-full pl-10 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <button type="submit" className="mt-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
            Save Member to Database
          </button>
        </form>
      )}

      {/* The Member List */}
      <div className="flex flex-col gap-3">
        {members.map(member => (
          <div key={member.id} className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors overflow-hidden">
            
            {/* INLINE EDIT MODE */}
            {editingId === member.id ? (
              <div className="p-5 bg-amber-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-slate-800">Edit {member.name}</h4>
                  <button onClick={cancelEditing} className="p-1 text-slate-400 hover:bg-slate-200 rounded-md">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                    <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                    <select value={editForm.isKid} onChange={e => setEditForm({...editForm, isKid: e.target.value === 'true'})} className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700 bg-white">
                      <option value="true">Kid</option>
                      <option value="false">Adult</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Color</label>
                    <div className="flex gap-2">
                      <input type="color" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} className="h-11 w-11 rounded-lg cursor-pointer border-0 p-0" />
                      <input type="text" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} className="flex-1 p-2.5 rounded-lg border border-slate-300 font-bold text-slate-700 uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avatar URL</label>
                    <input type="url" value={editForm.avatar} onChange={e => setEditForm({...editForm, avatar: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700 placeholder-slate-300" placeholder="https://..." />
                  </div>

                  {editForm.isKid && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sound</label>
                        <div className="flex gap-2">
                          <select value={editForm.signatureSound || 'mario-coin'} onChange={e => setEditForm({...editForm, signatureSound: e.target.value})} className="flex-1 p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700 bg-white">
                            <option value="mario-coin">🪙 Mario Coin</option>
                            <option value="level-up">🟩 Level Up</option>
                            <option value="fairy-chimes">✨ Fairy Chimes</option>
                            <option value="victory-fanfare">🎺 Victory Fanfare</option>
                            <option value="arcade-coin">🕹️ Arcade Coin</option>
                          </select>
                          <button type="button" onClick={() => playPreview(editForm.signatureSound || 'mario-coin')} className="p-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-indigo-600 transition-colors">
                            <Play className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pay Rate</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                          </div>
                          <input type="number" step="0.01" min="0" value={editForm.payRate} onChange={e => setEditForm({...editForm, payRate: parseFloat(e.target.value)})} className="w-full pl-9 p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={cancelEditing} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={handleSaveEdit} className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* NORMAL DISPLAY MODE */
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Visual Avatar rendering */}
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm border-2 border-white ring-2 ring-slate-100 shrink-0 overflow-hidden bg-cover bg-center" 
                    style={{ 
                      backgroundColor: member.color || '#cbd5e1',
                      backgroundImage: member.avatar ? `url(${member.avatar})` : 'none'
                    }}
                  >
                    {!member.avatar && member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-lg leading-tight flex items-center gap-2">
                      {member.name} 
                      {member.isKid && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{member.points || 0} pts</span>}
                    </div>
                    <div className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      {member.isKid ? 'Kid' : 'Adult'}
                      {member.isKid && member.payRate > 0 && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-500">${Number(member.payRate).toFixed(2)}/pt</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => startEditing(member)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Member">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Member">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
        
        {members.length === 0 && !loading && (
           <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-200 rounded-2xl">
             No family members found. Add one above!
           </div>
        )}
      </div>
    </div>
  );
}