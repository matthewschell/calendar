// src/components/dashboard/DailyContent.jsx
import { useState, useEffect } from 'react';
import { CloudSun, Lightbulb, Star, Smile } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDailyContent } from '../../hooks/useDailyContent';

export default function DailyContent() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherConfig, setWeatherConfig] = useState(null);
  
  const { content, loading: contentLoading } = useDailyContent();

  // 1. Listen for real-time weather settings from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'weather'), (docSnap) => {
      if (docSnap.exists()) {
        setWeatherConfig(docSnap.data());
      } else {
        // Safe default if settings haven't been saved yet
        setWeatherConfig({
          city: 'Whitby, ON',
          lat: 43.8975,
          lon: -78.9429,
          units: 'celsius',
          kidFriendly: true
        });
      }
    });
    return () => unsub();
  }, []);

  // 2. Fetch from Open-Meteo dynamically based on settings
  useEffect(() => {
    if (!weatherConfig) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const unitParam = weatherConfig.units === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
        // timezone=auto ensures the time matches whatever city was searched!
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.lat}&longitude=${weatherConfig.lon}&current=temperature_2m,weather_code${unitParam}&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.current);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [weatherConfig]);

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'; 
    if (code > 0 && code < 4) return '⛅'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code >= 51 && code <= 67) return '🌧️'; 
    if (code >= 71 && code <= 77) return '❄️'; 
    if (code >= 80 && code <= 82) return '🌧️'; 
    if (code >= 95) return '⛈️'; 
    return '☁️';
  };

  // Smart logic for Kid-Friendly Advice
  const getKidFriendlyAdvice = (code, temp) => {
    if (!weatherConfig?.kidFriendly) return null;
    
    let advice = [];
    const isFahrenheit = weatherConfig.units === 'fahrenheit';
    
    // Check for precipitation first
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) {
      advice.push('☂️ Grab an umbrella!');
    } else if (code >= 71 && code <= 77) {
      advice.push('🧤 Wear your mittens!');
    }

    // Check temperatures
    const coldThreshold = isFahrenheit ? 50 : 10;
    const hotThreshold = isFahrenheit ? 77 : 25;

    if (temp <= coldThreshold) {
      advice.push('🧥 You need a jacket!');
    } else if (temp >= hotThreshold && !advice.includes('☂️ Grab an umbrella!')) {
      advice.push('🕶️ Don\'t forget sunscreen!');
    }

    // Just return the most important piece of advice
    return advice.length > 0 ? advice[0] : null;
  };

  if (weatherLoading || contentLoading || !weatherConfig) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex gap-4 min-h-32 animate-pulse">
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  let config = { icon: <Lightbulb className="w-4 h-4" />, title: 'Fact of the Day', border: 'border-indigo-400', text: 'text-indigo-400' };
  if (content.type === 'override') {
    config = { icon: <Star className="w-4 h-4" />, title: 'Special Day!', border: 'border-amber-400', text: 'text-amber-500' };
  } else if (content.type === 'joke') {
    config = { icon: <Smile className="w-4 h-4" />, title: 'Joke of the Day', border: 'border-emerald-400', text: 'text-emerald-500' };
  }

  const currentTemp = Math.round(weather?.temperature_2m || 0);
  const tempUnit = weatherConfig.units === 'fahrenheit' ? '°F' : '°C';
  const advice = weather ? getKidFriendlyAdvice(weather.weather_code, currentTemp) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-linear-to-br from-sky-400 to-blue-500 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-sky-100 font-semibold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
              <CloudSun className="w-4 h-4" /> Local Weather
            </h3>
            <div className="text-3xl font-bold flex items-start gap-1">
              {currentTemp}
              <span className="text-lg text-sky-100 mt-1">{tempUnit}</span>
            </div>
            <div className="text-sky-100 text-sm mt-1">{weatherConfig.city}</div>
            
            {/* Kid Friendly Output Row */}
            {advice && (
              <div className="mt-2 text-xs font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm inline-block">
                {advice}
              </div>
            )}
            
          </div>
          <div className="text-6xl drop-shadow-md">{getWeatherEmoji(weather?.weather_code)}</div>
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-l-4 ${config.border}`}>
        <h3 className={`${config.text} font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2`}>
          {config.icon} {config.title}
        </h3>
        <div className="text-slate-700 font-medium text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text }} />
      </div>
    </div>
  );
}