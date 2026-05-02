// src/components/admin/SystemToolsTab.jsx
import { useState } from 'react';
import { Database, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { injectMarchAprilData, removeTestData } from '../../utils/testDataHelpers';

export default function SystemToolsTab() {
  const [loading, setLoading] = useState(false);

  const handleInject = async () => {
    if (!window.confirm("This will inject random chore completions for March and April 2026. Proceed?")) return;
    setLoading(true);
    await injectMarchAprilData();
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!window.confirm("This will permanently delete all injected test data. Proceed?")) return;
    setLoading(true);
    await removeTestData();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Database className="text-indigo-600" /> System & Data Tools
      </h3>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Inject Data Section */}
        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inject Historical Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Populate the database with random chore completions for March and April 2026. This allows you to test the historical bar and line charts in the kids' profiles without manually entering months of data.
          </p>
          <button 
            onClick={handleInject}
            disabled={loading}
            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Processing...' : 'Inject March & April Data'}
          </button>
        </div>

        {/* Remove Data Section */}
        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Remove Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Surgically remove only the test data injected by the tool above. Your real, manually entered chore completions will not be affected.
          </p>
          <button 
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold hover:bg-rose-200 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> {loading ? 'Processing...' : 'Delete Test Data'}
          </button>
        </div>

      </div>
    </div>
  );
}