import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../../config/firebase';

export default function EventModal({ isOpen, onClose, selectedDate, existingEvent, members }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    member: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to format Date objects to YYYY-MM-DD for input fields
  const toISODate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        // We are editing
        const rawStart = existingEvent.isMultiDay && existingEvent.startDate ? existingEvent.startDate : existingEvent.date;
        const rawEnd = existingEvent.isMultiDay && existingEvent.endDate ? existingEvent.endDate : '';
        
        setFormData({
          title: existingEvent.title || '',
          description: existingEvent.description || '',
          date: toISODate(rawStart),
          endDate: rawEnd ? toISODate(rawEnd) : '',
          time: existingEvent.time || '',
          endTime: existingEvent.endTime || '',
          member: Array.isArray(existingEvent.member) ? existingEvent.member : [existingEvent.member]
        });
      } else {
        // We are creating new
        setFormData({
          title: '',
          description: '',
          date: toISODate(selectedDate || new Date()),
          endDate: '',
          time: '',
          endTime: '',
          member: []
        });
      }
    }
  }, [isOpen, existingEvent, selectedDate]);

  if (!isOpen) return null;

  const handleMemberToggle = (id) => {
    setFormData(prev => {
      const newMembers = prev.member.includes(id)
        ? prev.member.filter(m => m !== id)
        : [...prev.member, id];
      return { ...prev, member: newMembers };
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date || formData.member.length === 0) return;
    setIsSaving(true);

    try {
      const startDate = new Date(formData.date + 'T00:00:00');
      const endDate = formData.endDate ? new Date(formData.endDate + 'T00:00:00') : startDate;
      const isMultiDay = startDate.getTime() !== endDate.getTime();
      
      const batch = writeBatch(db);
      const eventsRef = collection(db, 'calendarEvents');

      // If editing, delete the old event(s) first
      if (existingEvent) {
        if (existingEvent.groupId) {
          const q = query(eventsRef, where('groupId', '==', existingEvent.groupId));
          const snap = await getDocs(q);
          snap.forEach(d => batch.delete(d.ref));
        } else {
          batch.delete(doc(db, 'calendarEvents', existingEvent.id));
        }
      }

      // Generate the new events
      const groupId = existingEvent?.groupId || Date.now().toString();
      const iterDate = new Date(startDate);
      
      while (iterDate <= endDate) {
        const newDocRef = doc(eventsRef); // Auto-generate ID
        batch.set(newDocRef, {
          groupId,
          title: formData.title,
          description: formData.description || '',
          date: iterDate.toDateString(),
          member: formData.member,
          time: formData.time,
          endTime: formData.endTime,
          isMultiDay,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString()
        });
        iterDate.setDate(iterDate.getDate() + 1);
      }

      await batch.commit();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    let confirmMsg = `Delete "${existingEvent.title}"?`;
    if (existingEvent.isMultiDay && existingEvent.groupId) {
      confirmMsg = `This is a multi-day event. This will delete ALL days for "${existingEvent.title}". Are you sure?`;
    }

    if (!window.confirm(confirmMsg)) return;
    
    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      const eventsRef = collection(db, 'calendarEvents');
      
      if (existingEvent.groupId) {
        const q = query(eventsRef, where('groupId', '==', existingEvent.groupId));
        const snap = await getDocs(q);
        snap.forEach(d => batch.delete(d.ref));
      } else {
        batch.delete(doc(db, 'calendarEvents', existingEvent.id));
      }

      await batch.commit();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete. Check connection.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = formData.title && formData.date && formData.member.length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {existingEvent ? '✏️ Edit Event' : '➕ Add Event'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Event Title" 
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            maxLength={40}
            className={`w-full p-3 text-lg rounded-xl border-2 focus:outline-none transition-colors ${
              formData.title.length >= 36 ? 'border-amber-400 focus:border-amber-500' : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
          <div className="text-right text-xs mt-1 font-semibold text-slate-400">
            {formData.title.length}/40
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Start Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">End Date (Optional)</label>
            <input 
              type="date" 
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.date}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Start Time (Optional)</label>
            <input 
              type="time" 
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">End Time (Optional)</label>
            <input 
              type="time" 
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Description / WYSIWYG */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 mb-1">Event Description & Notes</label>
          <div className="bg-white rounded-xl overflow-hidden border-2 border-slate-200 focus-within:border-indigo-500 transition-colors">
            <ReactQuill 
              theme="snow" 
              value={formData.description || ''} 
              onChange={(content) => setFormData({ ...formData, description: content })}
              className="h-32 border-none [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b-2 [&_.ql-toolbar]:border-slate-100"
            />
          </div>
        </div>

        {/* Member Assignment */}
        <label className="block text-sm font-bold text-slate-700 mb-3">Assign To:</label>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Family Toggle */}
          <button 
            onClick={() => handleMemberToggle('family')}
            className={`p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all ${
              formData.member.includes('family') 
                ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {formData.member.includes('family') ? '☑' : '☐'} Family
          </button>
          
          {/* Misc Toggle */}
          <button 
            onClick={() => handleMemberToggle('misc')}
            className={`p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all ${
              formData.member.includes('misc') 
                ? 'bg-slate-200 text-slate-700 border-slate-300 shadow-inner' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {formData.member.includes('misc') ? '☑' : '☐'} Misc
          </button>
        </div>

        {/* Individual Members Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {members.map(m => {
            const isSelected = formData.member.includes(m.id);
            return (
              <button 
                key={m.id}
                onClick={() => handleMemberToggle(m.id)}
                className="p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all"
                style={{
                  backgroundColor: isSelected ? m.color : 'white',
                  borderColor: isSelected ? m.color : '#e2e8f0', // slate-200
                  color: isSelected ? 'white' : '#475569' // slate-600
                }}
              >
                {isSelected ? '☑' : '☐'} {m.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button 
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !isFormValid 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : existingEvent 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isSaving ? 'Saving...' : existingEvent ? 'Update Event' : 'Save Event'}
          </button>

          {existingEvent && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-3 rounded-xl font-bold text-red-500 bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-colors"
            >
              {isDeleting ? 'Deleting...' : '🗑 Delete Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}