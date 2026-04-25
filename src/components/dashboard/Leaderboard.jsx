import { Trophy } from 'lucide-react';
import { DEFAULT_MEMBERS } from '../../constants/defaults';

export default function Leaderboard() {
  // Filter for kids and mock some scores for testing the UI
  const kids = DEFAULT_MEMBERS.filter(m => m.isKid);
  const mockScores = { madison: 150, mason: 120, hudson: 95, hunter: 80 };

  // Sort kids by score descending
  const sortedKids = [...kids].sort((a, b) => (mockScores[b.id] || 0) - (mockScores[a.id] || 0));

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
        <Trophy className="text-amber-500 w-6 h-6" /> Leaderboard
      </h2>
      
      <div className="flex flex-col gap-2">
        {sortedKids.map((kid, index) => {
          const isFirst = index === 0;
          return (
            <div 
              key={kid.id} 
              className={`flex justify-between items-center p-3 rounded-xl border-2 transition-transform hover:scale-[1.02] cursor-pointer ${
                isFirst ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: kid.color }}
                >
                  {kid.name.charAt(0)}
                </div>
                <span className="font-semibold text-slate-700">{kid.name}</span>
              </div>
              <div className="font-bold text-amber-500 text-lg">
                {mockScores[kid.id] || 0} ⭐
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
