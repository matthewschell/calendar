import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import confetti from 'canvas-confetti';

const DEFAULT_SETTINGS = {
  duration: 5,
  soundUrl: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3',
  layers: [
    { type: 'cannons', colors: ['#667eea', '#764ba2', '#fbbf24', '#10b981', '#ef4444'], scale: 1, intensity: 1 },
    { type: 'fireworks', colors: ['#FFD700', '#FFA500', '#FF4500', '#ffffff'], scale: 2.5, intensity: 1.5 }
  ]
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

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

    if (config.soundUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(config.soundUrl);
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    const activeLayers = config.layers || [];

    activeLayers.forEach(layer => {
      const pCount = Math.max(1, Math.round(5 * layer.intensity)); 
      
      if (layer.type === 'cannons') {
        const frame = () => {
          confetti({ particleCount: pCount, angle: 60, spread: 55, origin: { x: 0 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 });
          confetti({ particleCount: pCount, angle: 120, spread: 55, origin: { x: 1 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } 
      
      else if (layer.type === 'fireworks') {
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          const fireworkCount = Math.round(6 * layer.intensity);
          confetti({
            particleCount: fireworkCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
            decay: 0.92, scalar: layer.scale, shapes: ['star'], colors: layer.colors,
            ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.1, 0.4), y: 0.9 }, zIndex: 100002,
          });
          confetti({
            particleCount: fireworkCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
            decay: 0.92, scalar: layer.scale, shapes: ['star'], colors: layer.colors,
            ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.6, 0.9), y: 0.9 }, zIndex: 100002,
          });
        }, 400);
      }

      else if (layer.type === 'rain') {
        const frame = () => {
          // Angle 270 shoots it straight down instead of up!
          confetti({ particleCount: pCount, angle: 270, startVelocity: 25, origin: { y: -0.1, x: Math.random() }, colors: layer.colors, scalar: layer.scale, zIndex: 100002, spread: 45, gravity: 1 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }

      else if (layer.type === 'snow') {
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const frame = () => {
          confetti({ 
            particleCount: pCount, 
            startVelocity: 0, // Set to 0 so it doesn't fly upwards off the screen!
            origin: { y: -0.1, x: Math.random() }, 
            colors: layer.colors, 
            scalar: layer.scale * randomInRange(0.6, 1.2), // Random sizes for realistic snowflakes
            shapes: ['circle'], 
            zIndex: 100002, 
            gravity: randomInRange(0.2, 0.5), // Random weight so they fall at different speeds
            drift: randomInRange(-0.6, 0.6), // Blow left and right in the wind
            ticks: 300 
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }

      else if (layer.type === 'realistic-burst') {
        const fireBurst = () => {
            const baseCount = Math.round(150 * layer.intensity);
            const burstParams = { origin: { y: 0.6, x: 0.5 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 };
            
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.25), spread: 26, startVelocity: 55 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.2), spread: 60 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.35), spread: 100, decay: 0.91, scalar: layer.scale * 0.8 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.1), spread: 120, startVelocity: 25, decay: 0.92, scalar: layer.scale * 1.2 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.1), spread: 120, startVelocity: 45 });
        };
        
        fireBurst();
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          fireBurst();
        }, 1500);
      }

      else if (layer.type === 'center-burst') {
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          confetti({
            particleCount: Math.round(50 * layer.intensity), spread: 360, startVelocity: 45,
            colors: layer.colors, scalar: layer.scale, origin: { x: 0.5, y: 0.5 }, zIndex: 100002
          });
        }, 800);
      }
    });
  };

  return { settings, loading, saveSettings, triggerCelebration };
}