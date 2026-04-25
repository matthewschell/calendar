import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Standard calendar math (ported from your legacy index.html)
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toDateString();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

  return (
    <div className="flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg h-full min-h-0">
      
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth} 
          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors font-bold flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{monthName}</h2>
          
          {/* Quick "Back to Today" button that only shows if you navigate away */}
          <div className="h-6 mt-1 flex items-center justify-center">
            {!isCurrentMonth && (
              <button 
                onClick={goToToday} 
                className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors animate-in fade-in zoom-in duration-300"
              >
                <CalendarIcon className="w-3 h-3" /> Back to Today
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={nextMonth} 
          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors font-bold flex items-center justify-center"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 text-center font-bold text-slate-400 text-xs md:text-sm mb-2 shrink-0">
        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
      </div>

      {/* Main Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1 auto-rows-fr min-h-0">
        
        {/* Empty slots for the start of the month padding */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="rounded-xl border-2 border-transparent bg-white/30"></div>
        ))}
        
        {/* Actual Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const isToday = dateObj.toDateString() === todayStr;

          return (
            <div 
              key={day} 
              onClick={() => alert(`You clicked on ${dateObj.toDateString()}! Event modal coming next.`)}
              className={`relative flex flex-col p-1 md:p-2 rounded-xl border-2 transition-colors cursor-pointer overflow-hidden ${
                isToday 
                  ? 'bg-amber-50 border-amber-300 shadow-sm ring-2 ring-amber-100 ring-offset-1' 
                  : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
              }`}
            >
              <span className={`text-xs md:text-sm font-bold w-fit ${
                isToday 
                  ? 'text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md shadow-sm' 
                  : 'text-slate-600 px-1'
              }`}>
                {day}
              </span>
              
              {/* Event rendering container (empty for now) */}
              <div className="flex-1 mt-1 overflow-y-auto hide-scrollbar flex flex-col gap-1">
                {/* Real events will be mapped here soon! */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}