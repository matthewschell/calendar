import { useState } from 'react';
import { getCalendarData, DAYS_OF_WEEK } from '../../utils/dateHelpers';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { daysInMonth, startingDayOfWeek, monthName, todayStr, year, month } = getCalendarData(currentDate);

  // Handlers for month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
          ◀
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-slate-800">{monthName}</h2>
          <button 
            onClick={goToday}
            className="text-xs font-bold text-indigo-500 hover:text-indigo-600 mt-1 uppercase tracking-wider"
          >
            ↩ Today
          </button>
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
          ▶
        </button>
      </div>

      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* The Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {/* Empty cells for days before the 1st */}
        {[...Array(startingDayOfWeek)].map((_, i) => (
          <div key={`empty-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50" />
        ))}
        
        {/* Actual days of the month */}
        {[...Array(daysInMonth)].map((_, i) => {
          const dayNumber = i + 1;
          const dateObj = new Date(year, month, dayNumber);
          const isToday = dateObj.toDateString() === todayStr;

          return (
            <div 
              key={dayNumber} 
              className={`border-b border-r border-slate-100 p-1 md:p-2 relative group cursor-pointer hover:bg-slate-50 transition-colors ${
                isToday ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-700'
              }`}>
                {dayNumber}
              </div>
              
              {/* Event Container Placeholder */}
              <div className="mt-1 flex flex-col gap-1 overflow-hidden h-[calc(100%-2rem)]">
                {/* We will map over actual events here later */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}