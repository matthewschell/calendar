import { useRef } from 'react';
import { Pin, AlertTriangle, Info, Star } from 'lucide-react';
import { useMessageCentre } from '../../hooks/useMessageCentre';

export default function MessageCentre() {
  const { messageData, loading } = useMessageCentre();
  
  // Refs for tracking rapid taps
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  if (loading) {
    return <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-24 animate-pulse"></div>;
  }

  // If inactive or completely empty, don't show
  if (!messageData || !messageData.isActive) return null;
  if (!messageData.content || messageData.content === '<p><br></p>' || messageData.content.trim() === '') return null;

  const themes = {
    info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: <Info className="w-6 h-6 text-sky-500" /> },
    important: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <Pin className="w-6 h-6 text-rose-500 fill-rose-500" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" /> }
  };

  const activeTheme = themes[messageData.type] || themes.info;

  // The secret 3-tap handler
  const handleSecretTap = () => {
    tapCountRef.current += 1;
    
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0; // Reset if they stop tapping for 2 seconds
    }, 2000);

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      clearTimeout(tapTimerRef.current);
      sessionStorage.setItem('targetAdminTab', 'widgets');
      sessionStorage.setItem('targetAdminSubTab', 'messages');
      window.dispatchEvent(new Event('openAdminToMessages'));
    }
  };

  return (
    <div className={`${activeTheme.bg} border-2 ${activeTheme.border} rounded-2xl p-5 shadow-md relative overflow-hidden transition-colors min-h-24 flex flex-col w-full min-w-0`}>
      
      <div 
        className="flex items-start justify-between mb-2 shrink-0 cursor-default select-none" 
        onClick={handleSecretTap}
      >
        <div className="flex items-center gap-3">
          {messageData.title && (
            <>
              {activeTheme.icon}
              <h3 className={`font-bold ${activeTheme.text} text-lg`}>{messageData.title}</h3>
            </>
          )}
        </div>
      </div>
      
      {/* 
        The w-full and min-w-0 prevents flexbox blowout from long words.
        [&_*]:!break-words ensures long URLs wrap safely.
        [&_*]:!whitespace-pre-wrap ensures Quill's intentional line breaks are preserved.
      */}
      <div 
        className={`${activeTheme.text} text-sm leading-relaxed flex-1 w-full min-w-0 [&_*]:!break-words [&_*]:!whitespace-pre-wrap [&_img]:!max-w-full [&_img]:!h-auto [&_img]:!rounded-lg [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>p]:mb-1`}
        dangerouslySetInnerHTML={{ __html: messageData.content }} 
      />
    </div>
  );
}