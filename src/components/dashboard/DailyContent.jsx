import { useState, useEffect } from 'react';
import { CloudSun, Lightbulb, Star, Smile, ChevronDown, X, Droplets } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDailyContent } from '../../hooks/useDailyContent';

export default function DailyContent() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherConfig, setWeatherConfig] = useState(null);
  
  // 'hourly' | 'daily' | null
  const [expandedView, setExpandedView] = useState(null);
  const [selectedDateString, setSelectedDateString] = useState(null);
  
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
        
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.lat}&longitude=${weatherConfig.lon}&current=temperature_2m,weather_code${unitParam}&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto&models=gem_seamless`
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
    if (code === 1) return '🌤️'; 
    if (code === 2) return '⛅'; 
    if (code === 3) return '☁️'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code === 51 || code === 53 || code === 61 || code === 80) return '🌦️'; 
    if (code === 55 || code === 63 || code === 65 || code === 81 || code === 82) return '🌧️'; 
    if (code >= 71 && code <= 77) return '❄️'; 
    if (code >= 85 && code <= 86) return '🌨️'; 
    if (code >= 95) return '⛈️'; 
    return '☁️';
  };

  const getKidFriendlyAdvice = (code, temp) => {
    if (!weatherConfig?.kidFriendly || code === undefined || temp === undefined) return null;
    
    const isF = weatherConfig.units === 'fahrenheit';
    const t = isF ? ((temp - 32) * 5/9) : temp; 
    
    const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95);
    const isSnow = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);

    if (isSnow) {
      if (t <= -5) return { emoji: '⛄', text: 'Snow & freezing! Full snow gear.' };
      return { emoji: '⛄', text: 'Snow day! Wear boots & mitts.' };
    }
    
    if (isRain) {
      if (t <= 5) return { emoji: '🥶', text: 'Freezing rain! Warm raincoat.' };
      if (t <= 15) return { emoji: '☂️', text: 'Cold & rainy. Raincoat & boots.' };
      return { emoji: '☂️', text: 'Rainy! Time for an umbrella.' };
    }

    if (t <= -5) return { emoji: '🧣', text: 'Freezing! Coat, toque & mitts.' };
    if (t <= 5) return { emoji: '🧥', text: 'Very chilly! Wear a warm coat.' };
    if (t <= 12) return { emoji: '🧥', text: 'Cool out! Bring a light jacket.' };
    if (t <= 18) return { emoji: '👕', text: 'Nice out! Light sweater weather.' };
    if (t <= 24) return { emoji: '🩳', text: 'Warm! T-shirt & shorts weather.' };
    return { emoji: '😎', text: 'Hot! Sunscreen, hat & lots of water!' };
  };

  const formatDay = (isoString) => {
    const d = new Date(`${isoString}T12:00:00`); 
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatHourAmPm = (timeString) => {
    const d = new Date(timeString);
    let hour = d.getHours();
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; 
    return `${hour}${ampm}`;
  };

  if (weatherLoading || contentLoading || !weatherConfig) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex gap-4 min-h-24 animate-pulse">
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  let contentMeta = { icon: <Lightbulb className="w-4 h-4" />, title: 'Fact of the Day', border: 'border-indigo-400', text: 'text-indigo-400' };
  if (content.type === 'override') {
    contentMeta = { icon: <Star className="w-4 h-4" />, title: 'Special Day!', border: 'border-amber-400', text: 'text-amber-500' };
  } else if (content.type === 'joke') {
    contentMeta = { icon: <Smile className="w-4 h-4" />, title: 'Joke of the Day', border: 'border-emerald-400', text: 'text-emerald-500' };
  }

  const currentTemp = Math.round(weather?.current?.temperature_2m || 0);
  const todayMax = weather?.daily?.temperature_2m_max?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_max[0]) : '--';
  const todayMin = weather?.daily?.temperature_2m_min?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_min[0]) : '--';
  const todayPop = weather?.daily?.precipitation_probability_max?.[0] || 0;
  
  const tempUnit = weatherConfig.units === 'fahrenheit' ? '°F' : '°C';
  const advice = weather ? getKidFriendlyAdvice(weather?.current?.weather_code, currentTemp) : null;

  // 6 additional days from the current day
  const dailyForecast = weather?.daily?.time?.slice(1, 7).map((time, i) => ({
    dateString: time,
    label: formatDay(time),
    temp: Math.round(weather.daily.temperature_2m_max[i + 1]),
    code: weather.daily.weather_code[i + 1],
    pop: weather.daily.precipitation_probability_max?.[i + 1] || 0
  })) || [];

  // Today's hours (6 AM, 9 AM, 12 PM, 3 PM, 6 PM, 9 PM)
  const todayIso = weather?.daily?.time?.[0] || new Date().toISOString().slice(0, 10);
  const todayHourlyForecast = weather?.hourly ? weather.hourly.time
    .map((t, idx) => ({
      time: t,
      temp: Math.round(weather.hourly.temperature_2m[idx]),
      code: weather.hourly.weather_code[idx],
      pop: weather.hourly.precipitation_probability?.[idx] || 0
    }))
    .filter(d => d.time.startsWith(todayIso))
    .filter(d => [6, 9, 12, 15, 18, 21].includes(new Date(d.time).getHours())) : [];

  // Hourly breakdown when drilling into a specific day from the 7-day view
  let selectedDayHourly = [];
  if (selectedDateString && weather?.hourly) {
    selectedDayHourly = weather.hourly.time
      .map((t, idx) => ({
        time: t,
        temp: Math.round(weather.hourly.temperature_2m[idx]),
        code: weather.hourly.weather_code[idx],
        pop: weather.hourly.precipitation_probability?.[idx] || 0
      }))
      .filter(d => d.time.startsWith(selectedDateString))
      .filter(d => [6, 9, 12, 15, 18, 21].includes(new Date(d.time).getHours()));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* WEATHER WIDGET */}
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden flex flex-col">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header - City & 2 Toggles */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-sky-100 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-4 h-4" /> Local Weather
            </h3>
            <span className="text-white/30 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wide">{weatherConfig.city}</span>
          </div>

          {/* TWO TOGGLES: Hourly & 7-Day */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => {
                if (expandedView === 'hourly') {
                  setExpandedView(null);
                } else {
                  setExpandedView('hourly');
                  setSelectedDateString(null);
                }
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                expandedView === 'hourly' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              aria-label="Toggle Hourly Forecast"
            >
              <span>Hourly</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedView === 'hourly' ? 'rotate-180' : ''}`} />
            </button>

            <button 
              onClick={() => {
                if (expandedView === 'daily') {
                  setExpandedView(null);
                  setSelectedDateString(null);
                } else {
                  setExpandedView('daily');
                  setSelectedDateString(null);
                }
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                expandedView === 'daily' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
              aria-label="Toggle 7-Day Forecast"
            >
              <span>7-Day</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expandedView === 'daily' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Current Conditions Horizontal Alignment */}
        <div className="relative z-10 flex items-center w-full mt-1">
          {/* LEFT: Current Temp & High/Low */}
          <div className="flex flex-col justify-center shrink-0 w-[90px] md:w-[110px]">
            <div className="text-5xl md:text-6xl font-black tracking-tighter leading-none flex items-start">
              {currentTemp}<span className="text-xl md:text-2xl text-sky-200 font-bold ml-0.5 mt-1">{tempUnit}</span>
            </div>
            <div className="text-[10px] md:text-xs font-bold text-sky-200 mt-1.5 bg-white/10 w-fit px-1.5 py-0.5 rounded-md flex items-center">
              H:{todayMax}° L:{todayMin}°
              {todayPop >= 20 && (
                <span className="flex items-center ml-1 border-l border-sky-200/30 pl-1">
                  <Droplets className="w-2.5 h-2.5 mr-0.5" />{todayPop}%
                </span>
              )}
            </div>
          </div>

          {/* MIDDLE: Weather Emoji */}
          <div className="text-6xl drop-shadow-xl shrink-0 ml-4 md:ml-6 flex items-center justify-center">
            {getWeatherEmoji(weather?.current?.weather_code)}
          </div>

          {/* Vertical Divider & Smart Advice */}
          {advice && (
            <>
              <div className="w-px h-14 bg-white/30 mx-4 md:mx-6 shrink-0"></div>
              
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="text-6xl drop-shadow-md shrink-0">
                  {advice.emoji}
                </div>
                <div className="text-[10px] md:text-xs font-bold leading-tight text-center sm:text-left text-white max-w-[130px]">
                  {advice.text}
                </div>
              </div>
            </>
          )}
        </div>

        {/* EXPANDED SECTION */}
        {expandedView && (
          <div className="mt-4 bg-white/10 rounded-xl p-3 overflow-hidden relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* 1. HOURLY TODAY VIEW */}
            {expandedView === 'hourly' && (
              <div className="flex flex-col animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="text-[10px] font-bold text-sky-100 uppercase tracking-wider mb-2 px-1">
                  Today's Hourly Forecast
                </div>
                <div className="flex justify-between w-full px-1">
                  {todayHourlyForecast.map((data, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center flex-1">
                      <span className="text-[10px] text-sky-100 font-bold uppercase">{formatHourAmPm(data.time)}</span>
                      <span className="text-xl md:text-2xl mt-1.5 mb-0.5 drop-shadow-sm">{getWeatherEmoji(data.code)}</span>
                      {data.pop >= 20 ? (
                        <span className="text-[9px] font-bold text-sky-200 flex items-center mb-1">
                          <Droplets className="w-2.5 h-2.5 mr-0.5" />{data.pop}%
                        </span>
                      ) : (
                        <span className="h-[14px] mb-1"></span>
                      )}
                      <span className="text-sm font-bold text-white">{data.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. 7-DAY (6 ADDITIONAL DAYS) VIEW */}
            {expandedView === 'daily' && (
              selectedDateString ? (
                /* Day Drill-Down View */
                <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wider">
                      Hourly • {formatDay(selectedDateString)}
                    </span>
                    <button 
                      onClick={() => setSelectedDateString(null)}
                      className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="flex justify-between w-full px-1">
                    {selectedDayHourly.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center flex-1">
                        <span className="text-[10px] text-sky-100 font-bold uppercase">{formatHourAmPm(data.time)}</span>
                        <span className="text-xl md:text-2xl mt-1.5 mb-0.5 drop-shadow-sm">{getWeatherEmoji(data.code)}</span>
                        {data.pop >= 20 ? (
                          <span className="text-[9px] font-bold text-sky-200 flex items-center mb-1">
                            <Droplets className="w-2.5 h-2.5 mr-0.5" />{data.pop}%
                          </span>
                        ) : (
                          <span className="h-[14px] mb-1"></span>
                        )}
                        <span className="text-sm font-bold text-white">{data.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Main 6 Additional Days View */
                <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="text-[10px] font-bold text-sky-100 uppercase tracking-wider mb-2 px-1">
                    6-Day Outlook (Tap a day for hourly)
                  </div>
                  <div className="flex justify-between w-full">
                    {dailyForecast.map((data, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedDateString(data.dateString)}
                        className="flex flex-col items-center text-center cursor-pointer hover:bg-white/20 p-2 -m-1 rounded-xl transition-colors group flex-1"
                      >
                        <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider group-hover:text-white transition-colors">{data.label}</span>
                        <span className="text-xl md:text-2xl mt-1.5 mb-0.5 drop-shadow-sm group-hover:scale-110 transition-transform">{getWeatherEmoji(data.code)}</span>
                        {data.pop >= 20 ? (
                          <span className="text-[9px] font-bold text-sky-200 flex items-center mb-1">
                            <Droplets className="w-2.5 h-2.5 mr-0.5" />{data.pop}%
                          </span>
                        ) : (
                          <span className="h-[14px] mb-1"></span>
                        )}
                        <span className="text-sm font-bold text-white">{data.temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* FACT / JOKE / OVERRIDE CARD */}
      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-l-4 ${contentMeta.border}`}>
        <h3 className={`${contentMeta.text} font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2`}>
          {contentMeta.icon} {contentMeta.title}
        </h3>
        <div className="text-slate-700 font-medium text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text }} />
      </div>
    </div>
  );
}