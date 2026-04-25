export default function DailyContent() {
  return (
    <div className="grid grid-cols-2 gap-3">
      
      {/* Fact / Joke Widget */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex flex-col justify-center">
        <div className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-wide">
          💡 Daily Fact
        </div>
        <div className="text-sm text-slate-700 leading-relaxed font-medium">
          Did you know there are more trees on Earth than stars in the Milky Way galaxy?
        </div>
      </div>

      {/* Weather Widget */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform">
        <div className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-wide flex justify-between items-center">
          <span>🌤️ Whitby</span>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">↻</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 font-medium leading-tight">
            Partly cloudy
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800 leading-none">18°</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Feels 20°</div>
          </div>
        </div>
      </div>

    </div>
  );
}