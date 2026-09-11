import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useKiosk } from './useKiosk';
import { playAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

export const EFFECTS = [
  { id: 'realistic-burst', label: '💥 Realistic Burst' },
  { id: 'cannons', label: '🎉 Side Cannons' },
  { id: 'fireworks', label: '⭐ Fireworks' },
  { id: 'rain', label: '🎊 Confetti Rain' },
  { id: 'snow', label: '❄️ Drifting Snow' },
  { id: 'center-burst', label: '🎆 Center Spinner' },
  { id: 'emoji', label: '😀 Custom Emojis' }
];

export const CELEB_PALETTES = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#d946ef'] },
  { id: 'gold', label: 'Gold & Silver', colors: ['#FFD700', '#FFA500', '#DAA520', '#F8F8FF', '#C0C0C0'] },
  { id: 'neon', label: 'Neon Cyber', colors: ['#FF1493', '#00FFFF', '#39FF14', '#FF00FF'] },
  { id: 'pastel', label: 'Spring Pastels', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
  { id: 'blizzard', label: 'Winter Blizzard', colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'] },
  { id: 'schell', label: 'Schell Family', colors: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'] }
];

export const POPULAR_EMOJIS = [
  '😀','😂','🥰','😎','🥳','🤩','🤡','👻','👽','🤖',
  '🦄','🐾','🦋','🦖','🐙','🦈','🍕','🍔','🍟','🍦',
  '🍩','🧁','⚽','🏀','🎮','🎸','🚀','🏎️','🚁','✨',
  '🔥','🎉','🎈','⭐','❤️','💩','👑','💎','💰','🏆'
];

export const DEFAULT_CELEBRATION = {
  type: 'particles', 
  videoUrl: '',
  duration: 0, // 0 = Auto (Play until media finishes)
  soundUrl: '',
  layers: [
    { type: 'cannons', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 },
    { type: 'fireworks', colors: CELEB_PALETTES[1].colors, scale: 2.5, intensity: 1.5 }
  ]
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_CELEBRATION);
  const [loading, setLoading] = useState(true);
  const { isMuted } = useKiosk();

  useEffect(() => {
    let isMounted = true;
    const unsub = onSnapshot(doc(db, 'settings', 'celebrations'), (docSnap) => {
      if (!isMounted) return;
      if (docSnap.exists()) setSettings({ ...DEFAULT_CELEBRATION, ...docSnap.data() });
      setLoading(false);
    }, () => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; unsub(); };
  }, []);

  const saveSettings = async (newSettings) => {
    await setDoc(doc(db, 'settings', 'celebrations'), newSettings, { merge: true });
  };

  const triggerCelebration = (overrideConfig = null) => {
    const config = overrideConfig || settings;
    const isAuto = config.duration === 0;
    
    let isPlaying = true;
    let fallbackTimer;

    if (!isAuto) {
      fallbackTimer = setTimeout(() => { isPlaying = false; }, config.duration * 1000);
    }

    // --- VIDEO CELEBRATION ENGINE ---
    if (config.type === 'video' && config.videoUrl) {
      const vid = document.createElement('video');
      vid.src = config.videoUrl;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.muted = isMuted; 
      vid.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 100005; pointer-events: none; background: black;";
      
      document.body.appendChild(vid);
      
      vid.onended = () => {
        isPlaying = false;
        if (document.body.contains(vid)) vid.remove();
      };
      
      const maxTime = isAuto ? 30000 : (config.duration * 1000 + 1000);
      setTimeout(() => {
        isPlaying = false;
        if (document.body.contains(vid)) vid.remove();
      }, maxTime); 

      return; 
    }

    // --- PARTICLE CELEBRATION ENGINE ---
    let audioHandled = false;
    if (config.soundUrl && !isMuted) {
      audioHandled = true;
      playAudio(config.soundUrl, () => {
        if (isAuto) isPlaying = false;
      });
    }

    if (isAuto && !audioHandled) {
      setTimeout(() => { isPlaying = false; }, 4000);
    }

    const activeLayers = config.layers || [];

    activeLayers.forEach(layer => {
      const pCount = Math.max(1, Math.round(5 * layer.intensity)); 
      
      // Build custom shapes for emojis if needed
      const customShapes = [];
      if (layer.type === 'emoji') {
        const emojisToUse = (layer.emojis && layer.emojis.length > 0) 
          ? layer.emojis 
          : (layer.emojiChar ? [layer.emojiChar] : ['😀']); // fallback for old configs
        
        emojisToUse.forEach(emo => {
          try {
            // Using a higher scalar here ensures the emoji bitmap is high resolution
            customShapes.push(confetti.shapeFromText({ text: emo, scalar: layer.scale * 2 }));
          } catch (e) {
            console.warn("Failed to create emoji shape:", e);
          }
        });
      }

      // Safe wrapper for launch to apply base styles dynamically
      const launchConfetti = (opts) => {
        const confettiOpts = {
          ...opts,
          zIndex: 100002,
          scalar: layer.scale
        };

        if (layer.type === 'emoji' && customShapes.length > 0) {
          confettiOpts.shapes = customShapes;
          // CRITICAL: We do NOT pass the 'colors' array for emojis. 
          // If you do, canvas-confetti tints them into solid silhouettes!
        } else {
          confettiOpts.colors = layer.colors;
          confettiOpts.shapes = layer.type === 'fireworks' ? ['star'] : ['square', 'circle'];
        }

        confetti(confettiOpts);
      };

      if (layer.type === 'cannons' || layer.type === 'emoji') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, angle: 60, spread: 55, origin: { x: 0 } });
          launchConfetti({ particleCount: pCount, angle: 120, spread: 55, origin: { x: 1 } });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      } 
      else if (layer.type === 'fireworks') {
        const r = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          launchConfetti({ particleCount: Math.round(6 * layer.intensity), angle: r(55, 125), spread: 60, startVelocity: r(55, 75), decay: 0.92, gravity: 0.8, ticks: 200, origin: { x: r(0.1, 0.4), y: 0.9 } });
          launchConfetti({ particleCount: Math.round(6 * layer.intensity), angle: r(55, 125), spread: 60, startVelocity: r(55, 75), decay: 0.92, gravity: 0.8, ticks: 200, origin: { x: r(0.6, 0.9), y: 0.9 } });
        }, 400);
      }
      else if (layer.type === 'rain') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, angle: 270, startVelocity: 25, origin: { y: -0.1, x: Math.random() }, spread: 45, gravity: 1 });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      }
      else if (layer.type === 'snow') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, startVelocity: 0, origin: { y: -0.1, x: Math.random() }, shapes: ['circle'], gravity: Math.random() * 0.3 + 0.2, drift: Math.random() * 1.2 - 0.6, ticks: 300 });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      }
      else if (layer.type === 'realistic-burst') {
        const fireBurst = () => {
            const b = Math.round(150 * layer.intensity);
            const opts = { origin: { y: 0.6, x: 0.5 } };
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.25), spread: 26, startVelocity: 55 });
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.2), spread: 60 });
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.35), spread: 100, decay: 0.91 });
        };
        fireBurst();
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          fireBurst();
        }, 1500);
      }
      else if (layer.type === 'center-burst') {
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          launchConfetti({ particleCount: Math.round(50 * layer.intensity), spread: 360, startVelocity: 45, origin: { x: 0.5, y: 0.5 } });
        }, 800);
      }
    });
  };

  return { settings, loading, saveSettings, triggerCelebration };
}