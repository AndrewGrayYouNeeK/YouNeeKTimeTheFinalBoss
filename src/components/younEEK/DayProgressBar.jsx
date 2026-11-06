const GREEN = '#7CFF6B';

function pad(value) { return String(value).padStart(2, '0'); }

export default function DayProgressBar({ time }) {
  return (
    <div className="w-full">
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        style={{ boxShadow: 'inset 0 0 12px rgba(255,255,255,0.04)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${time.progress * 100}%`,
            background: `linear-gradient(90deg, #2f8bff, ${GREEN}, #b84dff)`,
            boxShadow: `0 0 14px ${GREEN}88`,
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        <span>{time.dayPercent}% of day</span>
        <span>
          H{pad(time.units)} M{pad(time.minutes)} S{pad(time.seconds)}
        </span>
      </div>
    </div>
  );
}
