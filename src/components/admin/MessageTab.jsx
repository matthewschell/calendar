import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MessageSquare, Save, Power } from 'lucide-react';
import { useMessageCentre } from '../../hooks/useMessageCentre';

export default function MessageTab() {
  const { messageData, loading, saveMessage } = useMessageCentre();
  const [formData, setFormData] = useState(messageData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(messageData);
  }, [messageData]);

  if (loading) return <div className="animate-pulse p-4">Loading Message Centre...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    await saveMessage(formData);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-indigo-500" /> Message Centre Controls
          </h3>
          <p className="text-slate-500 text-sm">Pin a rich-text announcement to the top of the family dashboard.</p>
        </div>
        
        <button
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            formData.isActive 
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Power className="w-5 h-5" />
          {formData.isActive ? 'Widget Active' : 'Widget Hidden'}
        </button>
      </div>

      <div className={`bg-white p-6 rounded-2xl border-2 transition-all shadow-sm space-y-5 flex flex-col ${formData.isActive ? 'border-indigo-100' : 'border-slate-100 opacity-60'}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-700"
              placeholder="e.g., Weekend Plans!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Type (Color)</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-700 bg-white cursor-pointer"
            >
              <option value="info">📘 Info (Blue)</option>
              <option value="important">📕 Important (Red)</option>
              <option value="warning">📙 Warning (Yellow)</option>
              <option value="success">📗 Success (Green)</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
          <div className="bg-white rounded-xl border-2 border-slate-200 focus-within:border-indigo-500 transition-colors flex-1 w-full min-w-0">
            {/* 
              Aggressive CSS overrides to completely disable Quill's fixed heights, 
              force flexbox wrapping, and strictly break long words/URLs.
            */}
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(content) => setFormData({ ...formData, content })}
              className="
                flex flex-col w-full
                [&_.ql-container]:!border-none 
                [&_.ql-container]:!h-auto 
                [&_.ql-editor]:!min-h-[200px] 
                [&_.ql-editor]:!h-auto 
                [&_.ql-editor]:!max-w-full
                [&_.ql-editor]:!break-words 
                [&_.ql-editor]:!whitespace-pre-wrap 
                [&_.ql-editor]:overflow-x-hidden
                [&_.ql-toolbar]:!border-none 
                [&_.ql-toolbar]:!border-b 
                [&_.ql-toolbar]:!border-slate-100
                [&_.ql-toolbar]:!flex
                [&_.ql-toolbar]:!flex-wrap
              "
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Save className="w-5 h-5" /> {isSaving ? 'Saving to Database...' : 'Save & Publish Message'}
          </button>
        </div>
      </div>
    </div>
  );
}