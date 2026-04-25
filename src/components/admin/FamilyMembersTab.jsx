import { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserPlus, Trash2, Edit2 } from 'lucide-react';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function FamilyMembersTab() {
  const { members, loading } = useFamilyMembers();
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ 
    name: '', 
    color: '#3B82F6', 
    isKid: true, 
    signatureSound: 'mario-coin' 
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    
    // Generate a safe, unique ID (e.g., "Madison" -> "madison-8492")
    const id = newMember.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    try {
      // Surgical write to a specific document in the 'familyMembers' collection
      await setDoc(doc(db, 'familyMembers', id), {
        ...newMember,
        id
      });
      
      setNewMember({ name: '', color: '#3B82F6', isKid: true, signatureSound: 'mario-coin' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding member: ", error);
      alert("Failed to add member to database.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this family member? Their past history will remain safe.")) {
      // Surgical delete of just this document
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
          onClick={() => setIsAdding(!isAdding)}
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
            
            {newMember.isKid && (
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Signature Sound</label>
                <select value={newMember.signatureSound} onChange={e => setNewMember({...newMember, signatureSound: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition-colors bg-white">
                  <option value="mario-coin">🪙 Mario Coin</option>
                  <option value="level-up">🟩 Level Up</option>
                  <option value="fairy-chimes">✨ Fairy Chimes</option>
                  <option value="victory-fanfare">🎺 Victory Fanfare</option>
                  <option value="arcade-coin">🕹️ Arcade Coin</option>
                </select>
              </div>
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
          <div key={member.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-2 border-white ring-2 ring-slate-100" 
                style={{ backgroundColor: member.color }}
              >
                {member.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-800 text-lg leading-tight">{member.name}</div>
                <div className="text-sm font-medium text-slate-400">{member.isKid ? 'Kid' : 'Adult'}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => alert('Edit modal coming in next phase!')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Member">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Member">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
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