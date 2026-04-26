import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import confetti from 'canvas-confetti';

const DEFAULT_SETTINGS = {
  cannons: true,       // The rapid-fire side confetti
  fireworks: true,     // The giant legacy stars
  rain: false,         // Falling from the sky
  duration: 5,         // Seconds
  soundUrl: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3'
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  // Listen to the live celebration settings in Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'celebrations'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveSettings = async (newSettings) => {
    await setDoc(doc(db, 'systemSettings', 'celebrations'), newSettings);
  };

  const triggerCelebration = (overrideSettings = null) => {
    const config = overrideSettings || settings;
    const durationMs = config.duration * 1000;
    const end = Date.now() + durationMs;

    // 1. Play Sound
    if (config.soundUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(config.soundUrl);
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    // 2. LAYER 1: The Legacy Side Cannons
    if (config.cannons) {
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 100002 });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 100002 });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }

    // 3. LAYER 2: The Legacy Giant Star Fireworks
    if (config.fireworks) {
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      const interval = setInterval(function() {
        if (Date.now() > end) return clearInterval(interval);
        
        const particleCount = 6;
        const colors = ['#FFD700','#FFA500','#FF4500','#FF69B4','#00BFFF','#7FFF00','#ffffff'];
        
        // Left burst
        confetti({
          particleCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
          decay: 0.92, scalar: 2.5, shapes: ['star'], colors,
          ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.1, 0.4), y: 0.9 }, zIndex: 100002,
        });
        
        // Right burst
        confetti({
          particleCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
          decay: 0.92, scalar: 2.5, shapes: ['star'], colors,
          ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.6, 0.9), y: 0.9 }, zIndex: 100002,
        });
      }, 400);
    }

    // 4. LAYER 3: Confetti Rain
    if (config.rain) {
      const rainFrame = () => {
        confetti({ particleCount: 2, origin: { y: 0, x: Math.random() }, zIndex: 100002, spread: 90, gravity: 0.8 });
        if (Date.now() < end) requestAnimationFrame(rainFrame);
      };
      rainFrame();
    }
  };

  return { settings, loading, saveSettings, triggerCelebration };
}