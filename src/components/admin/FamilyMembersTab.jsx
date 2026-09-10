import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, setDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Edit2, Trash2, Plus, X, Loader2, Image as ImageIcon, Music, PlayCircle, UserCircle, Play, Volume2, Users } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression'; 
import { uploadToCloudflare } from '../../utils/cloudflareUploader';
import { playAudio } from '../../utils/audioPlayer';

export default function FamilyMembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeSubTab, setActiveSubTab] = useState('roster'); // 'roster' | 'avatars' | 'sounds'

  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [localSound, setLocalSound] = useState('');
  const [uploadingMemberAvatar, setUploadingMemberAvatar] = useState(false);

  const [avatarLibrary, setAvatarLibrary] = useState([]);
  const [soundLibrary, setSoundLibrary] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'familyMembers'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData.sort((a, b) => {
        if (a.participatesInChores === b.participatesInChores) {
          return (a.name || '').localeCompare(b.name || '');
        }
        return a.participatesInChores ? 1 : -1;
      }));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'avatars')).then(snap => { if (snap.exists()) setAvatarLibrary(snap.data().urls || []); });
    getDoc(doc(db, 'settings', 'sounds')).then(snap => { if (snap.exists()) setSoundLibrary(snap.data().items || []); });
  }, []);

  const openEditor = (member = null) => {
    setCurrentMember(member);
    setPreviewAvatar(member?.avatar || '');
    setLocalSound(member?.signatureSound || '');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        name: e.target.name.value,
        color: e.target.color.value,
        participatesInChores: e.target.role.value === 'kid',
        payRate: parseFloat(e.target.payRate.value) || 0,
        pin: e.target.pin.value || '',
        avatar: previewAvatar,
        signatureSound: localSound
      };

      if (currentMember?.id) {
        await updateDoc(doc(db, 'familyMembers', currentMember.id), memberData);
      } else {
        await addDoc(collection(db, 'familyMembers'), { ...memberData, points: 0 });
      }
      setIsEditing(false);
      setCurrentMember(null);
    } catch (error) {
      alert("Failed to save family member.");
    }
  };

  const handleMemberAvatarUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploadingMemberAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const url = await uploadToCloudflare(optimizedBlob, `avatar_${Date.now()}.jpg`);
      setPreviewAvatar(url);
    } catch (err) {
      alert("Upload failed.");
    }
    setUploadingMemberAvatar(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this member? All their data will be lost.")) await deleteDoc(doc(db, 'familyMembers', id));
  };

  const handleUploadToLibrary = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const url = await uploadToCloudflare(optimizedBlob, `library_${Date.now()}.jpg`);
      setAvatarLibrary(prev => [...prev, url]);
      await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayUnion(url) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    } 
    setUploadingAvatar(false);
  };

  const handleDeleteFromLibrary = async (url) => {
    if (!window.confirm("Remove this avatar from the library?")) return;
    setAvatarLibrary(prev => prev.filter(u => u !== url));
    await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayRemove(url) }, { merge: true });
  };

  const handleUploadSound = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    const soundName = window.prompt("Give this signature sound a short name:");
    if (!soundName) return;
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `sound_${Date.now()}_${file.name}`);
      setSoundLibrary(prev => [...prev, { name: soundName, url }]);
      await setDoc(doc(db, 'settings', 'sounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    }
    setUploadingSound(false);
  };

  const handleDeleteSound = async (soundObj) => {
    if (!window.confirm(`Remove "${soundObj.name}" from library?`)) return;
    setSoundLibrary(prev => prev.filter(s => s.url !== soundObj.url));
    await setDoc(doc(db, 'settings', 'sounds'), { items: arrayRemove(soundObj) }, { merge: true });
  };

  const formatDisplayRate = (rate) => {
    if (rate === undefined || rate === null || rate === 0) return '0.00';
    const num = Number(rate);
    const str = num.toString();
    if (str.includes('.') && str.split('.')[1].length > 2) {
      return num.toFixed(4).replace(/0+$/, '');
    }
    return num.toFixed(2);
  };

  if (loading) return <div className="p-4 animate-pulse">Loading members...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-slate-800 text-lg">{currentMember ? 'Edit Member' : 'New Member'}</h3>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
              <input name="name" defaultValue={currentMember?.name} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <select name="role" defaultValue={currentMember?.participatesInChores ? 'kid' : 'parent'} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500 cursor-pointer">
                <option value="kid">Kid</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Color</label>
              <input type="color" name="color" defaultValue={currentMember?.color || '#6366f1'} className="w-full h-[50px] p-1 border border-slate-200 rounded-xl cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pay Rate ($/pt)</label>
              <input 
                type="number" 
                step="any" 
                min="0"
                name="payRate" 
                defaultValue={currentMember?.payRate || 0} 
                placeholder="e.g. 0.0143"
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" 
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Supports sub-cents (e.g. 0.0143 for $10/700pts)</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile PIN</label>
              <input type="text" maxLength="4" name="pin" defaultValue={currentMember?.pin || ''} placeholder="e.g. 1234" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><Volume2 className="w-4 h-4" /> Signature Sound</label>
            <div className="flex gap-2">
              <select value={localSound} onChange={(e) => setLocalSound(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:border-indigo-500 cursor-pointer text-sm">
                <option value="">No Sound</option>
                {soundLibrary.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
              </select>
              <button type="button" onClick={() => playAudio(localSound)} className="bg-indigo-100 text-indigo-600 px-4 rounded-xl hover:bg-indigo-200 transition-colors cursor-pointer"><Play className="w-5 h-5 fill-current" /></button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3"><ImageIcon className="w-4 h-4" /> Profile Avatar</label>
            
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-slate-100 shadow-sm overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                {previewAvatar ? <img src={previewAvatar} className="w-full h-full object-cover" /> : <UserCircle className="w-10 h-10 text-slate-300" />}
              </div>
              
              <div className="flex-1">
                {avatarLibrary.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-2">
                    {avatarLibrary.map((url, idx) => (
                      <img key={idx} src={url} onClick={() => setPreviewAvatar(url)} className="w-12 h-12 rounded-lg cursor-pointer border-2 hover:border-indigo-500 object-cover shrink-0" />
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 text-sm">
                  {uploadingMemberAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Upload Custom
                  <input type="file" accept="image/*" className="hidden" onChange={handleMemberAvatarUpload} disabled={uploadingMemberAvatar} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">Save Member</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Sub-Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveSubTab('roster')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'roster' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Users className="w-4 h-4" /> Family Roster
        </button>
        <button 
          onClick={() => setActiveSubTab('avatars')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'avatars' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <ImageIcon className="w-4 h-4" /> Avatar Library
        </button>
        <button 
          onClick={() => setActiveSubTab('sounds')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'sounds' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Music className="w-4 h-4" /> Short Sound Library
        </button>
      </div>

      {activeSubTab === 'roster' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Family Members</h3>
            <button onClick={() => openEditor(null)} className="flex items-center gap-1 text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Member</button>
          </div>
          <div className="grid gap-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 shadow-sm border border-slate-100 object-cover overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-white" style={{ backgroundColor: member.color || '#ccc' }}>
                    {member.avatar ? <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" /> : member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{member.name}</div>
                    <div className="text-xs font-medium text-slate-500 flex gap-2">
                      <span className="uppercase tracking-wider">{member.participatesInChores ? 'Kid' : 'Parent'}</span>
                      <span>&bull;</span>
                      <span>Rate: ${formatDisplayRate(member.payRate)}/pt</span>
                      {member.pin && <span className="text-amber-500 flex items-center gap-1">🔒 Locked</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditor(member)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'avatars' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Default Avatar Library</h3>
              <p className="text-xs text-slate-500 mt-1">Images uploaded here will be available for kids to choose from in their profile modal.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {avatarLibrary.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl border-2 border-slate-200 overflow-hidden group bg-slate-50 shadow-sm">
                <img src={url} alt="Library Avatar" className="w-full h-full object-cover" />
                <button onClick={() => handleDeleteFromLibrary(url)} className="absolute top-1 right-1 bg-rose-500/90 text-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
              {uploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{uploadingAvatar ? '...' : 'Upload'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadToLibrary} disabled={uploadingAvatar} />
            </label>
          </div>
        </div>
      )}

      {activeSubTab === 'sounds' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Music className="w-5 h-5 text-indigo-500" /> Signature Sound Library</h3>
              <p className="text-xs text-slate-500 mt-1">Short audio files (MP3/WAV) uploaded here can be selected by kids as their chore completion sound.</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold cursor-pointer hover:bg-indigo-100 transition-colors shadow-sm text-sm shrink-0">
              {uploadingSound ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploadingSound ? 'Uploading...' : 'Upload Sound (Max 5MB)'}
              <input type="file" accept="audio/*" className="hidden" onChange={handleUploadSound} disabled={uploadingSound} />
            </label>
          </div>
          
          <div className="space-y-2 mt-4">
            {soundLibrary.length === 0 && <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">No custom sounds added yet. Use the System Tools tab to restore defaults!</div>}
            {soundLibrary.map((sound, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => playAudio(sound.url)} className="text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"><PlayCircle className="w-6 h-6" /></button>
                  <span className="font-bold text-slate-700">{sound.name}</span>
                </div>
                <button onClick={() => handleDeleteSound(sound)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer bg-white rounded-md shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}