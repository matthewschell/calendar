// src/components/admin/FamilyMembersTab.jsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { Edit2, Trash2, Plus, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export default function FamilyMembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Avatar Library State
  const [avatarLibrary, setAvatarLibrary] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'familyMembers'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData.sort((a, b) => {
        if (a.isKid === b.isKid) return a.name.localeCompare(b.name);
        return a.isKid ? 1 : -1;
      }));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Listen to the shared Avatar Library
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'avatars'), (docSnap) => {
      if (docSnap.exists()) {
        setAvatarLibrary(docSnap.data().urls || []);
      } else {
        setAvatarLibrary([]);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        name: e.target.name.value,
        color: e.target.color.value,
        isKid: e.target.role.value === 'kid',
        payRate: Number(e.target.payRate.value) || 0,
        pin: e.target.pin.value || ''
      };

      if (currentMember?.id) {
        await updateDoc(doc(db, 'familyMembers', currentMember.id), memberData);
      } else {
        await addDoc(collection(db, 'familyMembers'), {
          ...memberData,
          points: 0,
          avatar: ''
        });
      }
      setIsEditing(false);
      setCurrentMember(null);
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Failed to save family member.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member? All their data will be lost.")) {
      await deleteDoc(doc(db, 'familyMembers', id));
    }
  };

  // Avatar Library Handlers
  const handleUploadToLibrary = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fileRef = ref(storage, `avatars/library_${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      await setDoc(doc(db, 'settings', 'avatars'), {
        urls: arrayUnion(url)
      }, { merge: true });

    } catch (error) {
      console.error("Error uploading to library:", error);
      alert("Failed to upload default avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteFromLibrary = async (url) => {
    if (!window.confirm("Remove this avatar from the default choices?")) return;
    try {
      await setDoc(doc(db, 'settings', 'avatars'), {
        urls: arrayRemove(url)
      }, { merge: true });
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  if (loading) return <div className="p-4 animate-pulse">Loading members...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-slate-800 text-lg">
            {currentMember ? 'Edit Member' : 'New Member'}
          </h3>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
            <input 
              name="name" 
              defaultValue={currentMember?.name} 
              required 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <select 
                name="role" 
                defaultValue={currentMember?.isKid ? 'kid' : 'parent'}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="kid">Kid</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Color</label>
              <input 
                type="color" 
                name="color" 
                defaultValue={currentMember?.color || '#6366f1'} 
                className="w-full h-[50px] p-1 border border-slate-200 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pay Rate ($/pt)</label>
              <input 
                type="number" 
                step="0.01" 
                name="payRate" 
                defaultValue={currentMember?.payRate || 0} 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Security PIN (Optional)</label>
              <input 
                type="text" 
                maxLength="4"
                name="pin" 
                defaultValue={currentMember?.pin || ''} 
                placeholder="e.g. 1234"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Existing Member List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Family Roster</h3>
          <button 
            onClick={() => { setCurrentMember(null); setIsEditing(true); }}
            className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>

        <div className="grid gap-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full shrink-0 shadow-sm border border-slate-100 object-cover overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: member.color || '#ccc' }}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{member.name}</div>
                  <div className="text-xs font-medium text-slate-500 flex gap-2">
                    <span className="uppercase tracking-wider">{member.isKid ? 'Kid' : 'Parent'}</span>
                    <span>&bull;</span>
                    <span>Rate: ${member.payRate?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => { setCurrentMember(member); setIsEditing(true); }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Default Avatar Library Management */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">Default Avatar Library</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Images uploaded here will be available for kids to quickly choose from in their profile modal.</p>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
          {avatarLibrary.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl border-2 border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={url} alt="Library Avatar" className="w-full h-full object-cover" />
              <button 
                onClick={() => handleDeleteFromLibrary(url)}
                className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                title="Remove from library"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <label className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
            {uploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{uploadingAvatar ? '...' : 'Add'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadToLibrary} disabled={uploadingAvatar} />
          </label>
        </div>
      </div>

    </div>
  );
}