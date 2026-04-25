import Leaderboard from '../components/dashboard/Leaderboard';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-indigo-500 to-purple-600 p-4 md:p-6 flex flex-col h-screen overflow-hidden">
      
      {/* Mobile Header Placeholder */}
      <div className="md:hidden flex justify-between items-center mb-4 p-3 bg-black/20 rounded-xl text-white">
        <h1 className="text-lg font-bold">The Schells' Family Calendar</h1>
        <button className="bg-white/20 p-2 rounded-lg">⚙️</button>
      </div>

      {/* Main Grid: 2fr Calendar, 1fr Sidebar */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5">
        
        {/* Calendar Section (Left) */}
        <div className="flex-2 bg-white rounded-2xl shadow-2xl p-5 flex flex-col min-h-100">
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 font-medium">Calendar Grid Component Goes Here</p>
          </div>
        </div>

        {/* Sidebar Section (Right) */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
          <Leaderboard />
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
            <p className="text-slate-400 font-medium text-center">Today's Chores Component Goes Here</p>
          </div>
        </div>

      </div>
    </div>
  );
}