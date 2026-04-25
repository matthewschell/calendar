export default function MessageCentre() {
  const greeting = "Good morning Schells! 🌞";

  if (!greeting) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex items-center justify-center text-center min-h-20">
      <h2 className="text-2xl font-bold text-slate-800 leading-snug">
        {greeting}
      </h2>
    </div>
  );
}