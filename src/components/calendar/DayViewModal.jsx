import { X, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';

export default function DayViewModal({ 
  isOpen, 
  onClose, 
  date, 
  events, 
  members, 
  onAddEvent, 
  onEditEvent,
  onDeleteEvent,
  onDeleteEventGroup
}) {
  if (!isOpen || !date) return null;

  const getEventStripBackground = (event) => {
    if (!event.member) return '#cbd5e1';
    
    const memberIds = Array.isArray(event.member) ? event.member : [event.member];
    const isFamilyEvent = memberIds.includes('family');
    const isMisc = memberIds.includes('misc');

    if (isFamilyEvent) return 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)';
    if (isMisc) return '#cbd5e1';

    const colors = memberIds
      .filter(id => id !== 'misc')
      .map(id => members.find(m => m.id === id)?.color || '#cbd5e1');

    if (colors.length === 1) return colors[0];
    if (colors.length > 1) return `linear-gradient(180deg, ${colors.join(', ')})`;
    
    return '#cbd5e1';
  };

  const getMemberNames = (event) => {
    if (!event.member) return '';
    const memberIds = Array.isArray(event.member) ? event.member : [event.member];
    if (memberIds.includes('family')) return 'Family';
    if (memberIds.includes('misc')) return 'Misc';
    
    return memberIds
      .map(id => members.find(m => m.id === id)?.name || '')
      .filter(Boolean)
      .join(', ');
  };

  const handleDelete = (event) => {
    if (event.isMultiDay && event.groupId) {
      onDeleteEventGroup(event.groupId, event.title);
    } else {
      onDeleteEvent(event.id, event.title);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Gradient) */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-5 md:p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-1">
                {date.toLocaleDateString('default', { weekday: 'long' })}
              </div>
              <div className="text-3xl font-bold">
                {date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {events.length === 0 ? 'No events' : `${events.length} event${events.length !== 1 ? 's' : ''}`}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 transition-colors border-none text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="overflow-y-auto p-4 md:p-6 flex-1 bg-slate-50">
          {events.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              <div className="text-5xl mb-3">📭</div>
              <div className="text-lg font-semibold text-slate-600">Nothing scheduled</div>
              <div className="text-sm mt-1">Click below to add an event</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className="flex rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Color Strip */}
                  <div 
                    className="w-2 shrink-0" 
                    style={{ background: getEventStripBackground(event) }} 
                  />
                  
                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="font-bold text-base text-slate-900 mb-2">{event.title}</div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          {(event.time || event.endTime) && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                              <Clock className="w-3 h-3" />
                              {event.time}{event.time && event.endTime ? ' – ' : ''}{event.endTime}
                            </span>
                          )}
                          
                          <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            <Users className="w-3 h-3" />
                            {getMemberNames(event)}
                          </span>

                          {event.isMultiDay && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                              <CalendarIcon className="w-3 h-3" />
                              Multi-day
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons (Hide for Holidays) */}
                      {!event.isHoliday && (
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => onEditEvent(event)}
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(event)}
                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg text-sm font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-slate-200 bg-white shrink-0">
          <button
            onClick={() => onAddEvent(date)}
            className="w-full py-3.5 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-lg font-bold shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-5 h-5" /> Add Event
          </button>
        </div>
      </div>
    </div>
  );
}