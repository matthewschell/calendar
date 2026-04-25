import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Bring in our live data hooks
  const { events, loading: eventsLoading } = useEvents();
  const { members, loading: membersLoading } = useFamilyMembers();

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toDateString();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

  // Helper to determine the background color of an event based on who is tagged
  const getEventBackground = (event) => {
    if (!event.member || !members.length) return '#cbd5e1'; // slate-300 fallback
    
    // Make sure we are working with an array
    const memberIds = Array.isArray(event.member) ? event.member : [event.member];
    
    if (memberIds.includes('family')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; // Family gradient
    if (memberIds.includes('misc')) return 'transparent';
    
    // Single member color
    if (memberIds.length === 1) {
      const member = members.find(m => m.id === memberIds[0]);
      return member ? member.color : '#cbd5e1';
    }
    
    // Multiple members? Build a striped/gradient background!
    const colors = memberIds
      .filter(id => id !== 'family' && id !== 'misc')
      .map(id => members.find(m => m.id === id)?.color || '#cbd5e1');
      
    if (colors.length > 0) {
      return `linear-gradient(90deg, ${colors.join(', ')})`;
    }
    
    return '#cbd5e1';
  };

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
          const dateString = dateObj.toDateString();
          const isToday = dateString === todayStr;

          // Filter events for this specific day
          const dayEvents = events.filter(e => e.date === dateString);

          return (
            <div 
              key={day} 
              onClick={() => alert(`You clicked on ${dateString}! Add Event modal coming next.`)}
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
              
              {/* Render the events */}
              <div className="flex-1 mt-1 overflow-y-auto hide-scrollbar flex flex-col gap-1">
                {!eventsLoading && !membersLoading && dayEvents.map(event => {
                  const isMisc = Array.isArray(event.member) && event.member.includes('misc');
                  
                  return (
                    <div 
                      key={event.id} 
                      onClick={(e) => { e.stopPropagation(); alert(`Editing ${event.title}... UI coming next!`); }}
                      className="max-w-full overflow-hidden text-[10px] md:text-xs px-1.5 py-0.5 rounded text-white truncate font-medium shadow-sm transition-transform hover:scale-105"
                      style={{ 
                        background: getEventBackground(event),
                        color: isMisc ? '#475569' : 'white', // slate-600 for misc text
                        border: isMisc ? '1px solid #cbd5e1' : 'none'
                      }}
                      title={event.title}
                    >
                      {event.time && <span className="opacity-80 mr-1">{event.time}</span>}
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}