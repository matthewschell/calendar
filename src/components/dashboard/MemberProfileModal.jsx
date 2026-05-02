// src/components/dashboard/MemberProfileModal.jsx
import { useState } from 'react';
import { X, Upload, Image as ImageIcon, Wallet, Star, TrendingUp, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Player1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Player2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool&backgroundColor=ffdfbf',
];

export default function MemberProfileModal({ member, onClose }) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!member) return null;

  const currentPoints = member.points || 0;
  const payRate = member.payRate || 0;
  const estimatedPayout = (currentPoints * payRate).toFixed(2);

  const handleUpdateAvatar = async (avatarUrl) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), {
        avatar: avatarUrl
      });
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update avatar.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a unique file name in the 'avatars' folder
      const fileRef = ref(storage, `avatars/${member.id}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      await handleUpdateAvatar(downloadUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-4 mb-3 group">
            <img 
              src={member.avatar || DEFAULT_AVATARS[0]} 
              alt={member.name}
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover bg-indigo-100"
            />
            <button 
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tight">{member.name}</h2>
          <p className="text-indigo-200 font-medium text-sm mt-1 uppercase tracking-wider">Family Member</p>
        </div>

        {/* Content Section */}
        <div className="p-6">
          
          {isEditingAvatar ? (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-slate-800 text-center">Choose an Avatar</h3>
              
              <div className="grid grid-cols-4 gap-3">
                {DEFAULT_AVATARS.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleUpdateAvatar(url)}
                    className="aspect-square rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden"
                  >
                    <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 uppercase font-bold tracking-wider">Or</span>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>

              <button 
                onClick={() => setIsEditingAvatar(false)}
                className="w-full py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500 mb-2" />
                  <span className="text-3xl font-black text-amber-600 leading-none">{currentPoints}</span>
                  <span className="text-xs font-bold text-amber-600/70 uppercase tracking-wider mt-1">Current Points</span>
                </div>
                
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-500 mb-2" />
                  <span className="text-3xl font-black text-emerald-600 leading-none">${estimatedPayout}</span>
                  <span className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Est. Payout</span>
                </div>
              </div>

              {/* Pay Rate Info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Current Pay Rate</div>
                    <div className="text-xs text-slate-500 font-medium">How much each point is worth</div>
                  </div>
                </div>
                <div className="font-black text-indigo-600 text-lg">
                  ${payRate.toFixed(2)}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}