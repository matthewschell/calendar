import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useKiosk() {
  const [config, setConfig] = useState({
    manualDim: false,
    manualMute: false,
    dimIntensity: 0.85,
    quietTimeEnabled: false,
    quietTimeStart: '20:00',
    quietTimeEnd: '07:00'
  });
  
  const [isQuietTime, setIsQuietTime] = useState(false);
  const [isTemporarilyAwake, setIsTemporarilyAwake] = useState(false);
  
  const [isKioskDevice, setIsKioskDevice] = useState(() => localStorage.getItem('isKioskDevice') === 'true');

  const wakeTimerRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'kiosk'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  // Minute-by-Minute schedule checker with safe fallbacks
  useEffect(() => {
    if (!config.quietTimeEnabled) {
      setIsQuietTime(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const startTime = config.quietTimeStart || '20:00';
      const endTime = config.quietTimeEnd || '07:00';

      const [startH, startM] = startTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;

      const [endH, endM] = endTime.split(':').map(Number);
      const endMinutes = endH * 60 + endM;

      let active = false;
      if (startMinutes < endMinutes) {
        active = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
        active = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }
      setIsQuietTime(active);
    };

    checkTime(); 
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [config.quietTimeEnabled, config.quietTimeStart, config.quietTimeEnd]);

  useEffect(() => {
    if (!isKioskDevice) return; 

    const handleActivity = () => {
      setIsTemporarilyAwake(true);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
      wakeTimerRef.current = setTimeout(() => {
        setIsTemporarilyAwake(false);
      }, 60000); 
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    };
  }, [isKioskDevice]);

  const toggleKioskMode = (enabled) => {
    localStorage.setItem('isKioskDevice', enabled);
    setIsKioskDevice(enabled);
  };

  const isBaseDimmed = config.manualDim || isQuietTime;
  const isDimmed = isKioskDevice ? (isBaseDimmed && !isTemporarilyAwake) : false;
  const isMuted = isKioskDevice ? (config.manualMute || isQuietTime) : false;

  return { isDimmed, isMuted, dimIntensity: config.dimIntensity, isKioskDevice, toggleKioskMode };
}