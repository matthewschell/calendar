import { useState } from 'react';
import MessageCentre from '../components/dashboard/MessageCentre';
import DailyContent from '../components/dashboard/DailyContent';
import Leaderboard from '../components/dashboard/Leaderboard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ChoresPanel from '../components/chores/ChoresPanel';
import AdminModal from '../components/admin/AdminModal';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../hooks/useTheme';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme } = useTheme();

  // Resolve active theme settings globally
  const activePreset = THEME_PRESETS.find(p => p.id === theme?.preset) || THEME_PRESETS[0];
  const isCustom = theme?.preset === 'custom';
  
  let bgStyle = '';
  if (isCustom) {
    if (theme?.bgImageUrl) {
      bgStyle = `background-image: url(${theme.bgImageUrl}); background-color: ${theme.bgColor || '#667eea'};`;
    } else {
      bgStyle = `background: ${theme?.bgColor || '#667eea'};`;
    }
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (theme?.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === theme?.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(theme?.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${theme?.panelBlur ?? 8}px`;

  return (
    <>
      {activeFont.google && <link href={`https://fonts.googleapis.com/css2?family=${activeFont.google}&display=swap`} rel="stylesheet" />}
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
        }
        @media (min-width: 768px) { body { background-position: center ${theme?.bgPositionDesktop ?? 50}%; } }
        @media (max-width: 767px) { body { background-position: ${theme?.bgPositionMobile ?? 50}% center; } }
        
        /* Set CSS Glass Variables globally */
        :root {
          --glass-panel-bg: ${panelRgba};
          --glass-panel-blur: blur(${panelBlur});
          --theme-font-color: ${activeFontColor};
        }
      `}</style>
      
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5">
          <div className="flex-2 flex flex-col min-h-100">
            <CalendarGrid />
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 hide-scrollbar">
            <MessageCentre />
            <DailyContent />
            <Leaderboard />
            <ChoresPanel />
          </div>
        </div>

        <button 
          onClick={() => setShowAdmin(true)} 
          className="fixed bottom-3 left-3 p-2 text-white/30 hover:text-white/80 transition-all z-40 text-xl hover:rotate-90 drop-shadow-md"
          title="Admin Settings"
        >
          ⚙️
        </button>

        <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      </div>
    </>
  );
}