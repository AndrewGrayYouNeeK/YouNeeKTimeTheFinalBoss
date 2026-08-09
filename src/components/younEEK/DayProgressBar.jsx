const GREEN = '#39ff14';

function pad(value) { return String(value).padStart(2, '0'); }

export default function DayProgressBar({ time }) {
  return (
    <div className="w-full">
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/10"
        style={{ boxShadow: 'inset 0 0 12px rgba(255,255,255,0.04)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${time.progress * 100}%`,
            background: GREEN,
            boxShadow: `0 0 18px ${GREEN}ff`,
          }}
        />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 text-center">
        <span>{time.dayPercent}% of day</span>
        <span>H{pad(time.units)} M{pad(time.minutes)} S{pad(time.seconds)}</span>
      </div>
    </div>
  );
}