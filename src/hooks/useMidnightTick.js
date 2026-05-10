import { useState, useEffect } from 'react';

export function useMidnightTick() {
  const [todayStr, setTodayStr] = useState(() => new Date().toDateString());

  useEffect(() => {
    const checkDate = () => {
      const current = new Date().toDateString();
      setTodayStr((prev) => {
        if (prev !== current) return current;
        return prev;
      });
    };

    // 1. The Standard Heartbeat (every 60 seconds)
    const interval = setInterval(checkDate, 60000);

    // 2. The "Wake Up" Trigger (fires instantly when device screen turns on)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkDate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkDate);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkDate);
    };
  }, []);

  return todayStr;
}