import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import MessageCentre from '../components/dashboard/MessageCentre';
import DailyContent from '../components/dashboard/DailyContent';
import Leaderboard from '../components/dashboard/Leaderboard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ChoresPanel from '../components/chores/ChoresPanel';
import AdminModal from '../components/admin/AdminModal';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../hooks/useTheme';
import { preloadEntireLibrary } from '../utils/audioPlayer';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(null);

  // --- Silent Background Audio Caching ---
  useEffect(() => {
    const cacheLibrary = async () => {
      try {
        const shortSnap = await getDoc(doc(db, 'settings', 'sounds'));
        const celebSnap = await getDoc(doc(db, 'settings', 'celebSounds'));
        
        let urlsToCache = ["https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3"];
        
        if (shortSnap.exists() && shortSnap.data().items) {
          urlsToCache = [...urlsToCache, ...shortSnap.data().items.map(s => s.url)];
        }
        if (celebSnap.exists() && celebSnap.data().items) {
          urlsToCache = [...urlsToCache, ...celebSnap.data().items.map(s => s.url)];
        }
        
        preloadEntireLibrary(urlsToCache);
      } catch (e) {
        console.warn("Background sync paused:", e);
      }
    };
    
    const timer = setTimeout(cacheLibrary, 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- Live Preview Listener ---
  useEffect(() => {
    const handlePreview = (e) => setPreviewTheme(e.detail);
    window.addEventListener('themePreviewUpdate', handlePreview);
    return () => window.removeEventListener('themePreviewUpdate', handlePreview);
  }, []);

  // --- Jump to Admin Panel Event Listeners ---
  useEffect(() => {
    const handleOpenAdmin = () => setShowAdmin(true);
    window.addEventListener('openAdminToChores', handleOpenAdmin);
    window.addEventListener('openAdminToMessages', handleOpenAdmin);
    return () => {
      window.removeEventListener('openAdminToChores', handleOpenAdmin);
      window.removeEventListener('openAdminToMessages', handleOpenAdmin);
    };
  }, []);

  // --- Multi-tap invisible admin trigger (5 taps in 2.5s) ---
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleHiddenAdminTap = () => {
    tapCountRef.current += 1;
    
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      clearTimeout(tapTimerRef.current);
      setShowAdmin(true);
    }
  };

  const activeTheme = previewTheme || theme;
  const activePreset = THEME_PRESETS.find(p => p.id === activeTheme?.preset) || THEME_PRESETS[0];
  const isCustom = activeTheme?.preset === 'custom';
  
  let bgStyle = '';
  const imgUrlToUse = previewTheme?.bgPreview || activeTheme?.bgImageUrl;

  if (imgUrlToUse) {
    bgStyle = `background-image: url("${imgUrlToUse}"); background-color: ${activeTheme?.bgColor || '#667eea'};`;
  } else if (isCustom) {
    bgStyle = `background: ${activeTheme?.bgColor || '#667eea'};`;
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (activeTheme?.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === activeTheme?.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(activeTheme?.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${activeTheme?.panelBlur ?? 8}px`;

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));
  useEffect(() => {
    const handleOverrideChange = () => setLocalOverride(localStorage.getItem('bgPositionOverride'));
    window.addEventListener('localBgOverrideChanged', handleOverrideChange);
    return () => window.removeEventListener('localBgOverrideChanged', handleOverrideChange);
  }, []);

  const localOverrideActive = localOverride !== null && localOverride !== '';
  const effectiveDesktopPos = localOverrideActive ? localOverride : (activeTheme?.bgPositionDesktop ?? 50);
  const effectiveMobilePos = localOverrideActive ? localOverride : (activeTheme?.bgPositionMobile ?? 50);

  return (
    <>
      {activeFont.google && <link href={`https://fonts.googleapis.com/css2?family=${activeFont.google}&display=swap`} rel="stylesheet" />}
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
          transition: background 0.3s ease;
        }
        @media (min-width: 768px) { body { background-position: center ${effectiveDesktopPos}%; } }
        @media (max-width: 767px) { body { background-position: ${effectiveMobilePos}% center; } }
        
        :root {
          --glass-panel-bg: ${panelRgba};
          --glass-panel-blur: blur(${panelBlur});
          --theme-font-color: ${activeFontColor};
        }
      `}</style>
      
      {/* REMOVED: h-screen overflow-hidden 
        ADDED: md:h-screen md:overflow-hidden 
        This allows mobile to scroll naturally while keeping desktop locked 
      */}
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col md:h-screen md:overflow-hidden relative">
        
        <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-5 md:min-h-0">
          
          {/* Calendar Side: Unrestricted height on mobile, 2/3 ratio on desktop */}
          <div className="md:flex-[2] flex flex-col md:min-h-0">
            <CalendarGrid />
          </div>
          
          {/* Widgets Side: Added pb-24 for mobile so the hidden admin tap zone doesn't hide chores */}
          <div className="md:flex-1 flex flex-col gap-4 md:overflow-y-auto md:pr-2 pb-24 md:pb-4 hide-scrollbar">
            <MessageCentre />
            <DailyContent />
            <Leaderboard />
            <ChoresPanel />
          </div>

        </div>

        <div 
          onClick={handleHiddenAdminTap}
          className="fixed bottom-0 left-0 w-20 h-20 z-40 cursor-default select-none bg-transparent"
          title=""
          aria-hidden="true"
        />

        <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      </div>
    </>
  );
}