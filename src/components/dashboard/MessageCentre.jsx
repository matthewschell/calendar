import { Pin, AlertTriangle, Info, Star } from 'lucide-react';
import { useMessageCentre } from '../../hooks/useMessageCentre';

export default function MessageCentre() {
  const { messageData, loading } = useMessageCentre();

  if (loading) {
    return <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-32 animate-pulse"></div>;
  }

  if (!messageData || !messageData.isActive) return null;

  const themes = {
    info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: <Info className="w-6 h-6 text-sky-500" /> },
    important: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <Pin className="w-6 h-6 text-rose-500 fill-rose-500" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" /> }
  };

  const activeTheme = themes[messageData.type] || themes.info;

  return (
    <div className={`${activeTheme.bg} border-2 ${activeTheme.border} rounded-2xl p-5 shadow-md relative overflow-hidden transition-colors min-h-32 flex flex-col`}>
      <div className="flex items-center gap-3 mb-2 shrink-0">
        {activeTheme.icon}
        <h3 className={`font-bold ${activeTheme.text} text-lg`}>{messageData.title}</h3>
      </div>
      
      {/* Renders WYSIWYG HTML directly while enforcing tailwind styling for lists/links */}
      <div 
        className={`${activeTheme.text} text-sm leading-relaxed flex-1 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>p]:mb-2`}
        dangerouslySetInnerHTML={{ __html: messageData.content }} 
      />
    </div>
  );
}