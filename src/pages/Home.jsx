import { useState } from 'react';
import MessageCentre from '../components/dashboard/MessageCentre';
import DailyContent from '../components/dashboard/DailyContent';
import Leaderboard from '../components/dashboard/Leaderboard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ChoresPanel from '../components/chores/ChoresPanel';
import AdminModal from '../components/admin/AdminModal';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-indigo-500 to-purple-600 p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
      
      {/* Universal Header */}
      <div className="flex justify-between items-center mb-4 p-3 bg-black/20 md:bg-white/10 backdrop-blur-sm rounded-xl text-white shadow-sm">
        <h1 className="text-lg md:text-xl font-bold tracking-wide">The Schells' Family Calendar</h1>
        <button 
          onClick={() => setShowAdmin(true)} 
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors py-2 px-4 rounded-lg font-semibold text-sm"
        >
          ⚙️ <span className="hidden md:inline">Admin Panel</span>
        </button>
      </div>

      {/* Main Grid: 2fr Calendar, 1fr Sidebar */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5">
        
        {/* Calendar Section (Left) */}
        <div className="flex-2 flex flex-col min-h-100">
          <CalendarGrid />
        </div>

        {/* Sidebar Section (Right) */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
          <MessageCentre />
          <DailyContent />
          <Leaderboard />
          <ChoresPanel />
        </div>

      </div>

      {/* Render the modal at the root level */}
      <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
    </div>
  );
}