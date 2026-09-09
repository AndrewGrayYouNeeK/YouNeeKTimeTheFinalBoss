function pad(value) { return String(value).padStart(2, '0'); }

export default function DayProgressBar({ time }) {
  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2c2c2e]">
        <div
          className="h-full rounded-full bg-[#FF9F0A]"
          style={{ width: `${time.progress * 100}%` }}
        />
      </div>
      <div className="mt-3 flex flex-col items-center gap-1 text-center text-[13px] text-white/45">
        <span>{time.dayPercent}% of day</span>
        <span className="tabular-nums">H{pad(time.units)} M{pad(time.minutes)} S{pad(time.seconds)}</span>
      </div>
    </div>
  );
}
