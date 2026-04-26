import { useState, useRef } from 'react';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { UserPlus, Trash2, Edit2, Save, X, Play, DollarSign, UploadCloud } from 'lucide-react';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

// Authentic MP3 Sound Library from Cloudflare R2
const AUDIO_BASE = "https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/";
const SOUNDS = [
  { id: 'ac-nh',        label: '🍃 Animal Crossing NH',    file: 'Animal%20Crossing%20NH.mp3' },
  { id: 'bluey',        label: '🐶 Bluey Hooray',          file: 'Bluey%20Bingo%20Hooray.mp3' },
  { id: 'bosun',        label: '⚓ Bosun Whistle',         file: 'BosunWhistle.mp3' },
  { id: 'cash',         label: '💵 Cash Register',         file: 'CashRegister.mp3' },
  { id: 'chase',        label: '🚓 Chase is on the Case',  file: 'Chase%20is%20on%20the%20case.mp3' },
  { id: 'crow',         label: '🐦 Crow',                  file: 'Crow%20.mp3' },
  { id: 'ding',         label: '🔔 Ding',                  file: 'ding.mp3' },
  { id: 'duckhunt',     label: '🦆 Duck Hunt',             file: 'Duck%20hunt.mp3' },
  { id: 'siren',        label: '🚨 Fire Siren',            file: 'FireSiren.mp3' },
  { id: 'ghostbusters', label: '👻 Ghostbusters',          file: 'Ghostbusters%20.mp3' },
  { id: 'goat',         label: '🐐 Goat',                  file: 'Goat.mp3' },
  { id: 'owl',          label: '🦉 Great Horned Owl',      file: 'Great%20Horned%20Owl.mp3' },
  { id: 'laser',        label: '💥 Laser Sound',           file: 'Laser%20Sound.mp3' },
  { id: 'mario-ac',     label: '🍄 Mario Animal Crossing', file: 'Mario%20Animal%20Crossing.mp3' },
  { id: 'mario-coin',   label: '🪙 Mario Coin',            file: 'Mario%20Coin.mp3' },
  { id: 'mario-grow',   label: '🍄 Mario Grow',            file: 'MarioGrow.mp3' },
  { id: 'mc-levelup',   label: '🟩 Minecraft Level Up',    file: 'Minecraft%20level%20up%20sou.mp3' },
  { id: 'switch',       label: '🎮 Nintendo Switch',       file: 'Nintendo%20switch.mp3' },
  { id: 'peppa',        label: '🐷 Peppa Pig',             file: 'Peppa.mp3' },
  { id: 'pikachu',      label: '⚡ Pikachu',               file: 'Picachu.mp3' },
  { id: 'racing',       label: '🏎️ Racing Car',            file: 'Racing%20car.mp3' },
  { id: 'roblox-cel',   label: '🟦 Roblox Celebration',    file: 'Roblox%20celebration.mp3' },
  { id: 'roblox-yay',   label: '🟦 Roblox Yay',           file: 'Roblox%20yay.mp3' },
  { id: 'scream-goat',  label: '🐐 Screaming Goat',        file: 'Screaming%20goat.mp3' },
  { id: 'slide',        label: '🤪 Slide Whistle',         file: 'Slide%20whistle.mp3' },
  { id: 'tng-door',     label: '🖖 TNG Door',              file: 'TNG_Door.mp3' },
  { id: 'train',        label: '🚂 Train Horn',            file: 'Train%20horn.mp3' },
  { id: 'walle',        label: '🤖 Wall-E WHOA',           file: 'Wall-E%20WHOA%20.mp3' },
  { id: 'yeeps-alarm',  label: '🚨 Yeeps Alarm',           file: 'Yeeps%20alarm.mp3' },
  { id: 'yeeps-start',  label: '🏁 Yeeps Round Start',     file: 'Yeeps%20round%20start.mp3' },
  { id: 'yoshi',        label: '🦖 Yoshi',                 file: 'yoshi.mp3' },
  { id: 'vecna-clock',  label: '🕰️ Vecna\'s Clock',        file: 'VecnaClock.mp3' }
];

// Cloudflare Details from Legacy Code
const IMAGE_WORKER_URL = "https://schell-calendar-images.matthew-schell.workers.dev";
const IMAGE_UPLOAD_SECRET = "schell-calendar-2026";

export default function FamilyMembersTab() {
  const { members, loading } = useFamilyMembers();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const audioRef = useRef(null);
  
  const [newMember, setNewMember] = useState({ 
    name: '', 
    color: '#3B82F6', 
    isKid: true, 
    signatureSound: 'mario-coin',
    payRate: 0.10,
    previewAvatar: null
  });

  const playPreview = (soundId) => {
    const sound = SOUNDS.find(s => s.id === soundId);
    if (!sound) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(`${AUDIO_BASE}${sound.file}`);
    audioRef.current.play().catch(e => console.log("Audio play blocked or file missing:", e));
  };

  const deleteImageFromCloudflare = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('r2.dev')) return;
    try {
      await fetch(`${IMAGE_WORKER_URL}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Upload-Secret': IMAGE_UPLOAD_SECRET
        },
        body: JSON.stringify({ url: imageUrl })
      });
    } catch (err) {
      console.error('Failed to delete old image:', err);
    }
  };

  const compressAndUploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            const safeName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const formData = new FormData();
            formData.append('file', blob, safeName);
            
            try {
              const res = await fetch(`${IMAGE_WORKER_URL}/upload`, {
                method: 'POST',
                headers: { 'X-Upload-Secret': IMAGE_UPLOAD_SECRET },
                body: formData,
              });
              const data = await res.json();
              if (data.url) resolve(data.url);
              else reject(new Error('Upload failed'));
            } catch (err) {
              reject(err);
            }
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    
    setIsUploading(true);
    const id = newMember.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4);
    
    try {
      let avatarUrl = '';
      if (newAvatarFile) {
        avatarUrl = await compressAndUploadImage(newAvatarFile);
      }

      await setDoc(doc(db, 'familyMembers', id), {
        name: newMember.name,
        color: newMember.color,
        isKid: newMember.isKid,
        signatureSound: newMember.signatureSound,
        payRate: newMember.payRate,
        avatar: avatarUrl,
        id,
        points: 0 
      });
      
      setNewMember({ name: '', color: '#3B82F6', isKid: true, signatureSound: 'mario-coin', payRate: 0.10, previewAvatar: null });
      setNewAvatarFile(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding member: ", error);
      alert("Failed to add member to database.");
    } finally {
      setIsUploading(false);
    }
  };

  const startEditing = (member) => {
    setEditingId(member.id);
    setEditForm({ 
      ...member,
      payRate: member.payRate !== undefined ? member.payRate : 0.10,
      previewAvatar: null
    });
    setEditAvatarFile(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setEditAvatarFile(null);
  };

  const handleSaveEdit = async () => {
    setIsUploading(true);
    try {
      const originalMember = members.find(m => m.id === editingId);
      const originalAvatar = originalMember?.avatar;

      let finalAvatarUrl = editForm.avatar || '';

      if (editAvatarFile) {
        if (originalAvatar) await deleteImageFromCloudflare(originalAvatar);
        finalAvatarUrl = await compressAndUploadImage(editAvatarFile);
      } 
      else if (!editForm.avatar && originalAvatar) {
        await deleteImageFromCloudflare(originalAvatar);
      }

      await updateDoc(doc(db, 'familyMembers', editingId), {
        name: editForm.name,
        color: editForm.color,
        isKid: editForm.isKid,
        signatureSound: editForm.signatureSound,
        avatar: finalAvatarUrl,
        payRate: Number(editForm.payRate)
      });
      
      setEditingId(null);
      setEditForm(null);
      setEditAvatarFile(null);
    } catch (error) {
      console.error("Error updating member: ", error);
      alert("Failed to update member.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this family member? Their past history will remain safe.")) {
      const memberToDelete = members.find(m => m.id === id);
      if (memberToDelete?.avatar) {
        await deleteImageFromCloudflare(memberToDelete.avatar);
      }
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
          disabled={isUploading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isAdding ? 'Cancel' : <><UserPlus className="w-5 h-5" /> Add Member</>}
        </button>
      </div>

      {/* Add New Member Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-bold text-indigo-900">Add New Member</h4>

          {/* Avatar Preview & Upload Area */}
          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-2 border-white ring-2 ring-slate-100 shrink-0 overflow-hidden bg-cover bg-center" 
              style={{ 
                backgroundColor: newMember.color || '#cbd5e1',
                backgroundImage: newMember.previewAvatar ? `url(${newMember.previewAvatar})` : 'none'
              }}
            >
              {!newMember.previewAvatar && (newMember.name ? newMember.name.charAt(0).toUpperCase() : '?')}
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewAvatarFile(file);
                    setNewMember({...newMember, previewAvatar: URL.createObjectURL(file)});
                  }
                }} 
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Name</label>
              <input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold text-slate-700 transition-colors" placeholder="e.g. Mason" required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Type</label>
              <select value={newMember.isKid} onChange={e => setNewMember({...newMember, isKid: e.target.value === 'true'})} className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold text-slate-700 transition-colors bg-white">
                <option value="true">Kid</option>
                <option value="false">Adult</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Colour</label>
              <input type="color" value={newMember.color} onChange={e => setNewMember({...newMember, color: e.target.value})} className="h-10.5 w-full rounded-lg cursor-pointer border border-slate-300 p-0" />
            </div>
            
            {newMember.isKid && (
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Pay Rate (Per Point)</label>
                <div className="relative w-2/3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input type="number" step="0.01" min="0" value={newMember.payRate} onChange={e => setNewMember({...newMember, payRate: parseFloat(e.target.value)})} className="w-full pl-9 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold text-slate-700 transition-colors" />
                </div>
              </div>
            )}

            {newMember.isKid && (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-1">Signature Sound</label>
                <div className="flex gap-4">
                  <select value={newMember.signatureSound} onChange={e => setNewMember({...newMember, signatureSound: e.target.value})} className="w-full md:w-1/2 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 font-bold text-slate-700 transition-colors bg-white">
                    {SOUNDS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => playPreview(newMember.signatureSound)} className="p-2.5 px-4 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-indigo-600 transition-colors shrink-0 flex items-center justify-center" title="Preview Sound">
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={isUploading} className={`mt-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center gap-2 ${isUploading ? 'opacity-70 cursor-wait' : ''}`}>
            {isUploading ? <><UploadCloud className="w-5 h-5 animate-bounce" /> Uploading & Saving...</> : 'Save Member to Database'}
          </button>
        </form>
      )}

      {/* The Member List */}
      <div className="flex flex-col gap-3">
        {members.map(member => (
          <div key={member.id} className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors overflow-hidden">
            
            {/* INLINE EDIT MODE */}
            {editingId === member.id ? (
              <div className="p-5 bg-amber-50/50 flex flex-col gap-5">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800">Edit {member.name}</h4>
                  <button onClick={cancelEditing} disabled={isUploading} className="p-1 text-slate-400 hover:bg-slate-200 rounded-md">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Avatar Preview Block */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-2 border-white ring-2 ring-slate-100 shrink-0 overflow-hidden bg-cover bg-center" 
                    style={{ 
                      backgroundColor: editForm.color || '#cbd5e1',
                      backgroundImage: (editForm.previewAvatar || editForm.avatar) ? `url(${editForm.previewAvatar || editForm.avatar})` : 'none'
                    }}
                  >
                    {!(editForm.previewAvatar || editForm.avatar) && editForm.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Update Profile Photo</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        const file = e.target.files[0];
                        if(file) {
                          setEditAvatarFile(file);
                          setEditForm({...editForm, previewAvatar: URL.createObjectURL(file)});
                        }
                      }} 
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
                    />
                    {(editForm.avatar || editForm.previewAvatar) && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditForm({ ...editForm, avatar: '', previewAvatar: null });
                          setEditAvatarFile(null);
                        }} 
                        className="mt-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕ Remove Photo
                      </button>
                    )}
                  </div>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Colour</label>
                    <input type="color" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} className="h-10.5 w-full rounded-lg cursor-pointer border border-slate-300 p-0" />
                  </div>

                  {editForm.isKid && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pay Rate</label>
                      <div className="relative w-2/3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                        </div>
                        <input type="number" step="0.01" min="0" value={editForm.payRate} onChange={e => setEditForm({...editForm, payRate: parseFloat(e.target.value)})} className="w-full pl-9 p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700" />
                      </div>
                    </div>
                  )}

                  {editForm.isKid && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Signature Sound</label>
                      <div className="flex gap-4">
                        <select value={editForm.signatureSound || 'mario-coin'} onChange={e => setEditForm({...editForm, signatureSound: e.target.value})} className="w-full md:w-1/2 p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 font-bold text-slate-700 bg-white">
                          {SOUNDS.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => playPreview(editForm.signatureSound || 'mario-coin')} className="p-2.5 px-4 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-indigo-600 transition-colors shrink-0 flex items-center justify-center" title="Preview Sound">
                          <Play className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={cancelEditing} disabled={isUploading} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-50">Cancel</button>
                  <button onClick={handleSaveEdit} disabled={isUploading} className={`px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 flex items-center gap-2 ${isUploading ? 'opacity-70 cursor-wait' : ''}`}>
                    {isUploading ? <UploadCloud className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />} 
                    {isUploading ? 'Saving...' : 'Save Changes'}
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
                  <button onClick={() => startEditing(member)} disabled={isUploading} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50" title="Edit Member">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(member.id)} disabled={isUploading} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete Member">
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