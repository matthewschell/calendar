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

      {/* Floating Admin Button */}
      <button 
        onClick={() => setShowAdmin(true)} 
        className="fixed bottom-5 right-5 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full shadow-2xl transition-all hover:scale-110 z-40 text-xl"
        title="Admin Settings"
      >
        ⚙️
      </button>

      {/* Render the modal at the root level */}
      <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
    </div>
  );
}