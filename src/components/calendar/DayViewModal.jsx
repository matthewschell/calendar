import { X, Plus, Edit2, Trash2 } from 'lucide-react';

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

  const dateString = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{dateString}</h2>
            <p className="text-slate-500 font-medium text-sm">{events.length} Events Scheduled</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3 hide-scrollbar">
          {events.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">Nothing scheduled for today!</p>
            </div>
          ) : (
            events.map(event => {
              const isMisc = Array.isArray(event.member) && event.member.includes('misc');
              let bgColor = '#cbd5e1'; // slate-300 default
              
              if (event.member?.includes('family')) {
                bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              } else if (isMisc) {
                bgColor = '#f8fafc';
              } else if (event.member?.length === 1) {
                const member = members.find(m => m.id === event.member[0]);
                if (member) bgColor = member.color;
              } else if (event.member?.length > 1) {
                const colors = event.member
                  .filter(id => id !== 'family' && id !== 'misc')
                  .map(id => members.find(m => m.id === id)?.color || '#cbd5e1');
                if (colors.length > 0) bgColor = `linear-gradient(90deg, ${colors.join(', ')})`;
              }

              return (
                <div 
                  key={event.id} 
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all hover:shadow-md ${isMisc ? 'border-slate-200' : 'border-transparent text-white'}`}
                  style={{ background: bgColor, color: isMisc ? '#334155' : 'white' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg leading-tight">{event.title}</h4>
                      {event.time && (
                        <span className="text-sm font-semibold opacity-90 flex items-center gap-1 mt-1">
                          🕒 {event.time} {event.endTime ? `- ${event.endTime}` : ''}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons (Hide for generated holidays) */}
                    {!event.isHoliday && (
                      <div className="flex gap-1 shrink-0 ml-4 bg-white/20 p-1 rounded-xl backdrop-blur-sm">
                        <button 
                          onClick={() => onEditEvent(event)} 
                          className="p-1.5 hover:bg-white/30 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {event.isMultiDay ? (
                          <button 
                            onClick={() => onDeleteEventGroup(event.groupId, event.title)} 
                            className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors"
                            title="Delete Entire Multi-Day Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => onDeleteEvent(event.id, event.title)} 
                            className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Render the Rich Text Description */}
                  {event.description && event.description !== '<p><br></p>' && (
                    <div 
                      className={`mt-2 text-sm opacity-90 border-t pt-2 ${isMisc ? 'border-slate-200' : 'border-white/20'} [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4`}
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                  
                  {/* Assigned Members Bubbles */}
                  {Array.isArray(event.member) && event.member.length > 0 && !event.member.includes('family') && !isMisc && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {event.member.map(memberId => {
                        const m = members.find(x => x.id === memberId);
                        if (!m) return null;
                        return (
                          <span key={memberId} className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {m.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Add Button */}
        <div className="pt-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={() => onAddEvent(date)}
            className="w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Event Here
          </button>
        </div>

      </div>
    </div>
  );
}