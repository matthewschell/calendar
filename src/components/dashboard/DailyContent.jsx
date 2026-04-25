import { useState, useEffect } from 'react';
import { CloudSun, Lightbulb, Star, Smile } from 'lucide-react';
import { useDailyContent } from '../../hooks/useDailyContent';

export default function DailyContent() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const { content, loading: contentLoading } = useDailyContent();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherRes = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=43.8975&longitude=-78.9429&current=temperature_2m,weather_code&timezone=America/Toronto'
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
  }, []);

  const getWeatherEmoji = (code) => {
    if (code === 0) return '☀️'; 
    if (code > 0 && code < 4) return '⛅'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code >= 51 && code <= 67) return '🌧️'; 
    if (code >= 71 && code <= 77) return '❄️'; 
    if (code >= 95) return '⛈️'; 
    return '☁️';
  };

  if (weatherLoading || contentLoading) {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-linear-to-br from-sky-400 to-blue-500 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-sky-100 font-semibold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
              <CloudSun className="w-4 h-4" /> Local Weather
            </h3>
            <div className="text-3xl font-bold">{Math.round(weather?.temperature_2m || 0)}°C</div>
            <div className="text-sky-100 text-sm mt-1">Whitby, ON</div>
          </div>
          <div className="text-5xl drop-shadow-md">{getWeatherEmoji(weather?.weather_code)}</div>
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