// src/components/dashboard/DailyContent.jsx
import { useState, useEffect } from 'react';
import { CloudSun, Lightbulb, Star, Smile, ChevronDown } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDailyContent } from '../../hooks/useDailyContent';

export default function DailyContent() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherConfig, setWeatherConfig] = useState(null);
  const [isForecastExpanded, setIsForecastExpanded] = useState(false);
  
  const { content, loading: contentLoading } = useDailyContent();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'weather'), (docSnap) => {
      if (docSnap.exists()) {
        setWeatherConfig(docSnap.data());
      } else {
        setWeatherConfig({
          city: 'Whitby, ON',
          lat: 43.8975,
          lon: -78.9429,
          units: 'celsius',
          displayMode: 'daily',
          kidFriendly: true
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!weatherConfig) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const unitParam = weatherConfig.units === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
        
        // Always fetch the extended data so it's ready when they expand it
        const modeParam = weatherConfig.displayMode === 'hourly' 
          ? '&hourly=temperature_2m,weather_code&forecast_days=2' 
          : `&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7`;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.lat}&longitude=${weatherConfig.lon}&current=temperature_2m,weather_code${unitParam}${modeParam}&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [weatherConfig]);

  const getWeatherEmoji = (code) => {
    if (code === undefined || code === null) return '☁️';
    if (code === 0) return '☀️'; 
    if (code > 0 && code < 4) return '⛅'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code >= 51 && code <= 67) return '🌧️'; 
    if (code >= 71 && code <= 77) return '❄️'; 
    if (code >= 80 && code <= 82) return '🌧️'; 
    if (code >= 95) return '⛈️'; 
    return '☁️';
  };

  const getKidFriendlyAdvice = (code, temp) => {
    if (!weatherConfig?.kidFriendly || code === undefined || temp === undefined) return null;
    
    let advice = [];
    const isFahrenheit = weatherConfig.units === 'fahrenheit';
    
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 99)) {
      advice.push('☂️ Grab an umbrella!');
    } else if (code >= 71 && code <= 77) {
      advice.push('🧤 Wear your mittens!');
    }

    const coldThreshold = isFahrenheit ? 50 : 10;
    const hotThreshold = isFahrenheit ? 77 : 25;

    if (temp <= coldThreshold) {
      advice.push('🧥 You need a jacket!');
    } else if (temp >= hotThreshold && !advice.includes('☂️ Grab an umbrella!')) {
      advice.push('🕶️ Don\'t forget sunscreen!');
    }

    return advice.length > 0 ? advice[0] : null;
  };

  const formatDay = (isoString) => {
    const d = new Date(`${isoString}T12:00:00`); 
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatHour = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', '').toLowerCase();
  };

  if (weatherLoading || contentLoading || !weatherConfig) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex gap-4 min-h-24 animate-pulse">
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

  const currentTemp = Math.round(weather?.current?.temperature_2m || 0);
  const tempUnit = weatherConfig.units === 'fahrenheit' ? '°F' : '°C';
  const advice = weather ? getKidFriendlyAdvice(weather?.current?.weather_code, currentTemp) : null;

  let forecastData = [];
  if (weatherConfig.displayMode === 'hourly' && weather?.hourly) {
    const nowTime = new Date().getTime();
    const startIndex = weather.hourly.time.findIndex(t => new Date(t).getTime() > nowTime - 3600000);
    const start = startIndex > -1 ? startIndex : 0;
    forecastData = weather.hourly.time.slice(start, start + 6).map((time, i) => ({
      label: i === 0 ? 'Now' : formatHour(time),
      temp: Math.round(weather.hourly.temperature_2m[start + i]),
      code: weather.hourly.weather_code[start + i]
    }));
  } else if (weatherConfig.displayMode === 'daily' && weather?.daily) {
    // Skip today (index 0) and show the next 6 days
    forecastData = weather.daily.time.slice(1, 7).map((time, i) => ({
      label: formatDay(time),
      temp: Math.round(weather.daily.temperature_2m_max[i + 1]),
      code: weather.daily.weather_code[i + 1]
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-linear-to-br from-sky-400 to-blue-500 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden flex flex-col">
        
        {/* Top Header Row with Expand Toggle */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <h3 className="text-sky-100 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CloudSun className="w-4 h-4" /> Local Weather
          </h3>
          {forecastData.length > 0 && (
            <button 
              onClick={() => setIsForecastExpanded(!isForecastExpanded)}
              className="text-sky-100 hover:text-white transition-colors focus:outline-none flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md"
            >
              {weatherConfig.displayMode === 'hourly' ? 'Hours' : '6-Day'}
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isForecastExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Ultra-Compact Main Weather Row */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="text-4xl drop-shadow-md shrink-0">
            {getWeatherEmoji(weather?.current?.weather_code)}
          </div>
          
          <div className="flex flex-col justify-center shrink-0">
            <div className="text-2xl font-bold flex items-start tracking-tighter leading-none">
              {currentTemp}
              <span className="text-sm text-sky-100 font-semibold tracking-normal mt-0.5">{tempUnit}</span>
            </div>
            <div className="text-sky-100 text-[10px] uppercase tracking-wider mt-1 font-medium truncate max-w-22.5">
              {weatherConfig.city}
            </div>
          </div>

          {advice && (
            <>
              <div className="w-px h-8 bg-white/30 shrink-0 mx-1"></div>
              <div className="flex-1 text-xs font-bold leading-tight flex items-center">
                {advice}
              </div>
            </>
          )}
        </div>

        {/* Expandable Forecast Section */}
        {isForecastExpanded && forecastData.length > 0 && (
          <div className="relative z-10 mt-4 pt-4 border-t border-white/20 flex justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            {forecastData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider">{data.label}</span>
                <span className="text-2xl my-1 drop-shadow-sm">{getWeatherEmoji(data.code)}</span>
                <span className="text-sm font-bold text-white">{data.temp}°</span>
              </div>
            ))}
          </div>
        )}

        {/* Decorative Background Glow */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
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