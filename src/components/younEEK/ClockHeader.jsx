function pad(v) { return String(v).padStart(2, '0'); }

export default function ClockHeader({ now, time }) {
  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;

  return (
    <div className="header relative">
      <div className="text-center relative z-10 px-2">
        <div className="header-title-reveal mx-auto max-w-lg relative">
          <p className="font-mono text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.35em] sm:tracking-[0.45em] font-bold lightning-reveal-title">
            YouNeeK Time
          </p>
          <p className="mt-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold lightning-reveal-subtitle">
            by Andrew Gray
          </p>
          <div className="header-rain-trickle" aria-hidden="true" />
        </div>

        <div className="mt-10 sm:mt-12 inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-right">Regular Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-center">•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-left">{standardTime}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-right" style={{ textShadow: '0 0 8px #1f990a99' }}>YouNeeK Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-center" style={{ textShadow: '0 0 8px #1f990a99' }}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-left" style={{ textShadow: '0 0 8px #1f990a99' }}>{army12Str}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-right" style={{ textShadow: '0 0 8px #2dd90099' }}>Pineal Army Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-center" style={{ textShadow: '0 0 8px #2dd90099' }}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-left" style={{ textShadow: '0 0 8px #2dd90099' }}>{armyStr}</div>
        </div>
      </div>
    </div>
  );
}
