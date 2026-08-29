const SYNODIC_MONTH = 29.53058867;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

function getMoonData(now) {
  const daysSinceNewMoon = (now.getTime() - KNOWN_NEW_MOON) / 86400000;
  const normalizedPhase = ((daysSinceNewMoon % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseFraction = normalizedPhase / SYNODIC_MONTH;
  const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * phaseFraction));

  let name = 'New Moon';
  if (phaseFraction >= 0.03 && phaseFraction < 0.22) name = 'Waxing Crescent';
  else if (phaseFraction >= 0.22 && phaseFraction < 0.28) name = 'First Quarter';
  else if (phaseFraction >= 0.28 && phaseFraction < 0.47) name = 'Waxing Gibbous';
  else if (phaseFraction >= 0.47 && phaseFraction < 0.53) name = 'Full Moon';
  else if (phaseFraction >= 0.53 && phaseFraction < 0.72) name = 'Waning Gibbous';
  else if (phaseFraction >= 0.72 && phaseFraction < 0.78) name = 'Last Quarter';
  else if (phaseFraction >= 0.78) name = 'Waning Crescent';

  return {
    name,
    cyclePercent: phaseFraction * 100,
    illumination,
    waxing: phaseFraction < 0.5
  };
}

export default function MoonPhaseCard({ now }) {
  const moon = getMoonData(now);
  const shadowOffset = moon.illumination * 28;

  return (
    <div className="mx-auto w-full max-w-[18rem] rounded-[1.6rem] border border-[#ff6a00]/15 bg-[#101010] px-6 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_0_26px_rgba(255,106,0,0.06)] text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#e2e8f0] shadow-[0_0_28px_rgba(255,244,200,0.28)]">
          <div
            className="absolute inset-0 rounded-full bg-[#101010]"
            style={{ transform: `translateX(${moon.waxing ? -shadowOffset : shadowOffset}px)` }}
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-base uppercase tracking-[0.22em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{moon.name}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-white/42">{moon.cyclePercent.toFixed(1)}% cycle</p>
        </div>
      </div>
    </div>
  );
}