import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import confetti from 'canvas-confetti';

const DEFAULT_SETTINGS = {
  style: 'fireworks', // fireworks, cannons, stars, rain
  duration: 5,        // 3, 5, or 10 seconds
  intensity: 100,     // particle count modifier
  soundUrl: ''        // path to an mp3 in the public folder
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Listen to the live celebration settings in Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'celebrations'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveSettings = async (newSettings) => {
    await setDoc(doc(db, 'systemSettings', 'celebrations'), newSettings);
  };

  const triggerCelebration = (overrideSettings = null) => {
    const activeSettings = overrideSettings || settings;
    const end = Date.now() + (activeSettings.duration * 1000);

    // 1. Play Sound (if configured)
    if (activeSettings.soundUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(activeSettings.soundUrl);
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    // 2. Fire the Confetti Engine based on chosen Style
    const fire = () => {
      if (Date.now() > end) return;

      if (activeSettings.style === 'cannons') {
        confetti({ particleCount: activeSettings.intensity / 20, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, zIndex: 9999 });
        confetti({ particleCount: activeSettings.intensity / 20, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, zIndex: 9999 });
        requestAnimationFrame(fire);
      } 
      else if (activeSettings.style === 'fireworks') {
        const particleCount = activeSettings.intensity / 5;
        confetti({ particleCount, startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 + 0.1 } });
        setTimeout(fire, 250);
      }
      else if (activeSettings.style === 'stars') {
        const defaults = { spread: 360, ticks: 50, gravity: 0, decay: 0.94, startVelocity: 30, shapes: ['star'], colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'], zIndex: 9999 };
        confetti({ ...defaults, particleCount: activeSettings.intensity / 5, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.5 + 0.2 } });
        setTimeout(fire, 200);
      }
      else if (activeSettings.style === 'rain') {
        confetti({ particleCount: activeSettings.intensity / 10, origin: { y: 0, x: Math.random() }, zIndex: 9999, spread: 90, gravity: 0.8 });
        requestAnimationFrame(fire);
      }
    };

    fire();
  };

  return { settings, loading, saveSettings, triggerCelebration };
}