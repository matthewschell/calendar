import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const THEME_PRESETS = [
  { id: 'default',   label: '🏠 Default',    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', font: '#1f2937' },
  { id: 'spring',    label: '🌸 Spring',     bg: 'linear-gradient(135deg, #f9a8d4 0%, #86efac 100%)', font: '#1f2937' },
  { id: 'summer',    label: '☀️ Summer',    bg: 'linear-gradient(135deg, #fde68a 0%, #fb923c 100%)', font: '#1f2937' },
  { id: 'fall',      label: '🍂 Fall',       bg: 'linear-gradient(135deg, #d97706 0%, #7c2d12 100%)', font: '#1f2937' },
  { id: 'winter',    label: '❄️ Winter',    bg: 'linear-gradient(135deg, #bfdbfe 0%, #6366f1 100%)', font: '#1f2937' },
  { id: 'halloween', label: '🎃 Halloween',  bg: 'linear-gradient(135deg, #f97316 0%, #111827 100%)', font: '#ffffff' },
  { id: 'christmas', label: '🎄 Christmas',  bg: 'linear-gradient(135deg, #15803d 0%, #dc2626 100%)', font: '#ffffff' },
  { id: 'custom',    label: '🎨 Custom',     bg: '', font: '#1f2937' }
];

export const FONT_OPTIONS = [
  { id: 'system',    label: 'System Default', css: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { id: 'comic',     label: 'Comic Sans / Casual', css: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' },
  { id: 'serif',     label: 'Classic Serif',  css: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'mono',      label: 'Monospace',      css: '"Courier New", Courier, monospace' },
  { id: 'nunito',    label: 'Nunito (Friendly)', css: '"Nunito", sans-serif', google: 'Nunito:wght@400;600;700;800' },
  { id: 'poppins',   label: 'Poppins (Round)',   css: '"Poppins", sans-serif', google: 'Poppins:wght@400;500;600;700' },
  { id: 'rubik',     label: 'Rubik (Soft)',      css: '"Rubik", sans-serif', google: 'Rubik:wght@400;500;600;700' }
];

export function useTheme() {
  const [theme, setTheme] = useState({
    preset: 'default',
    bgImageUrl: '',
    bgColor: '#667eea',
    fontColor: '#1f2937',
    fontFamily: 'system',
    bgPositionDesktop: 50,
    bgPositionMobile: 50,
    panelOpacity: 90,
    panelBlur: 8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'appTheme'), (docSnap) => {
      if (docSnap.exists()) {
        setTheme(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveTheme = async (newTheme) => {
    await setDoc(doc(db, 'systemSettings', 'appTheme'), newTheme, { merge: true });
  };

  return { theme, loading, saveTheme };
}