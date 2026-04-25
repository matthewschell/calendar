import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { HOLIDAYS_DATA } from '../../utils/holidays';
import EventModal from './EventModal';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Live Data Hooks
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

  // Helper to combine database events and generated holidays
  const getEventsForDate = (dateString) => {
    const calendarEvents = events.filter(e => e.date === dateString);
    const holidayEvents = HOLIDAYS_DATA.filter(h => h.date === dateString);
    return [...holidayEvents, ...calendarEvents];
  };

  // Helper to determine the background color of an event
  const getEventBackground = (event) => {
    if (!event.member || !members.length) return '#cbd5e1'; 
    
    const memberIds = Array.isArray(event.member) ? event.member : [event.member];
    
    if (memberIds.includes('family')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (memberIds.includes('misc')) return 'transparent';
    
    if (memberIds.length === 1) {
      const member = members.find(m => m.id === memberIds[0]);
      return member ? member.color : '#cbd5e1';
    }
    
    const colors = memberIds
      .filter(id => id !== 'family' && id !== 'misc')
      .map(id => members.find(m => m.id === id)?.color || '#cbd5e1');
      
    if (colors.length > 0) return `linear-gradient(90deg, ${colors.join(', ')})`;
    
    return '#cbd5e1';
  };

  const handleDayClick = (dateObj) => {
    setSelectedDate(dateObj);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation(); 
    if (event.isHoliday) return; // Don't open the modal for hardcoded holidays
    setSelectedDate(null);
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleFabClick = () => {
    setSelectedDate(new Date());
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg h-full min-h-0 relative">
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors font-bold flex items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{monthName}</h2>
            <div className="h-6 mt-1 flex items-center justify-center">
              {!isCurrentMonth && (
                <button onClick={goToToday} className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors animate-in fade-in zoom-in duration-300">
                  <CalendarIcon className="w-3 h-3" /> Back to Today
                </button>
              )}
            </div>
          </div>

          <button onClick={nextMonth} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-xl transition-colors font-bold flex items-center justify-center">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Days of the Week Header */}
        <div className="grid grid-cols-7 text-center font-bold text-slate-400 text-xs md:text-sm mb-2 shrink-0">
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>

        {/* Main Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-1 auto-rows-fr min-h-0">
          
          {/* Empty Padding */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-xl border-2 border-transparent bg-white/30"></div>
          ))}
          
          {/* Actual Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateString = dateObj.toDateString();
            const isToday = dateString === todayStr;

            // Fetch both holidays and db events for this day
            const dayEvents = getEventsForDate(dateString);

            return (
              <div 
                key={day} 
                onClick={() => handleDayClick(dateObj)}
                className={`relative flex flex-col p-1 md:p-2 rounded-xl border-2 transition-colors cursor-pointer overflow-hidden ${
                  isToday 
                    ? 'bg-amber-50 border-amber-300 shadow-sm ring-2 ring-amber-100 ring-offset-1' 
                    : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                <span className={`text-xs md:text-sm font-bold w-fit ${
                  isToday ? 'text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md shadow-sm' : 'text-slate-600 px-1'
                }`}>
                  {day}
                </span>
                
                {/* Events list */}
                <div className="flex-1 mt-1 overflow-y-auto hide-scrollbar flex flex-col gap-1">
                  {!eventsLoading && !membersLoading && dayEvents.map(event => {
                    const isMisc = Array.isArray(event.member) && event.member.includes('misc');
                    
                    return (
                      <div 
                        key={event.id} 
                        onClick={(e) => handleEventClick(e, event)}
                        className={`max-w-full overflow-hidden text-[10px] md:text-xs px-1.5 py-0.5 rounded text-white truncate font-medium shadow-sm transition-transform ${!event.isHoliday ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                        style={{ 
                          background: getEventBackground(event),
                          color: isMisc ? '#475569' : 'white',
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

      <button 
        onClick={handleFabClick}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDate={selectedDate}
        existingEvent={editingEvent}
        members={members}
      />
    </>
  );
}