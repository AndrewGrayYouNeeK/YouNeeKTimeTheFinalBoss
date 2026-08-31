import { useEffect, useRef, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockDial from '@/components/younEEK/ClockDial';
import ClockTypeSelect from '@/components/younEEK/ClockTypeSelect';
import ClockTimeLegend from '@/components/younEEK/ClockTimeLegend';
import DayProgressBar from '@/components/younEEK/DayProgressBar';
import HapticTimeManager from '@/components/younEEK/HapticTimeManager';
import FrequencyManager from '@/components/younEEK/FrequencyManager';
import LiveMoonPhaseCard from '@/components/younEEK/LiveMoonPhaseCard';
import AboutSection from '@/components/younEEK/AboutSection';
import HandStyleSelect from '@/components/younEEK/HandStyleSelect';
import AstronautFlyer from '@/components/younEEK/AstronautFlyer';
import SecondsOverlay from '@/components/younEEK/SecondsOverlay';
import { formatDigital, PREFS_EVENT, readClockSource, readHandStyle } from '@/lib/clockPrefs';
import { maybeLaunchThump } from '@/lib/launchThump';
import { clockScale, lerp, smoothstep } from '@/lib/parallax';

export default function YouNeekClock({ p = 0, overscroll = 0 }) {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const [isGlitching, setIsGlitching] = useState(false);
  const [source, setSource] = useState(readClockSource);
  const [handStyle, setHandStyle] = useState(readHandStyle);
  const hour = now.getHours();
  const skipGlitch = useRef(true);
  const hubRef = useRef(null);
  const dialRef = useRef(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 16);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const sync = () => {
      setSource(readClockSource());
      setHandStyle(readHandStyle());
    };
    window.addEventListener(PREFS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(PREFS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    maybeLaunchThump(p);
  }, [p]);

  useEffect(() => {
    if (skipGlitch.current) {
      skipGlitch.current = false;
      return;
    }
    setIsGlitching(true);
    const glitchTimer = setTimeout(() => setIsGlitching(false), 3000);
    return () => clearTimeout(glitchTimer);
  }, [hour]);

  // Sticky collapse — Apple Music style. Drive scale directly from p (no withAnimation).
  const scale = clockScale(p);
  const digitSize = lerp(2.4, 1.05, smoothstep(0.3, 0.6, p));
  const showBrand = p < 0.35;
  const voidStretch = 1 + overscroll / 400;

  return (
    <div
      className={`mx-auto flex w-full max-w-[36rem] flex-col items-center px-4 pb-28 transition-colors duration-100 ${isGlitching ? 'bg-black' : 'bg-transparent'}`}
      style={{ transform: overscroll > 0 ? `scaleY(${voidStretch})` : undefined, transformOrigin: 'top center' }}
    >
      <div className="clock-sticky w-full">
        <div
          className={`flex w-full flex-col items-center pt-[max(0.5rem,env(safe-area-inset-top))] ${isGlitching ? 'opacity-0' : ''}`}
          style={{
            gap: lerp(12, 4, smoothstep(0.3, 0.6, p)),
            paddingBottom: lerp(12, 6, smoothstep(0.3, 0.6, p)),
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            willChange: 'transform',
          }}
        >
          {showBrand && (
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#00b7ff]/70">YouNeeK Time</p>
          )}
          <div
            className="font-mono font-semibold tracking-[0.14em]"
            style={{ color: '#ffe600', fontSize: `${digitSize}rem` }}
          >
            {formatDigital(time, source)}
          </div>
          <div className={`w-full overflow-visible ${isGlitching ? 'animate-glitch' : ''}`}>
            <ClockDial
              ref={dialRef}
              time={time}
              isGlitching={isGlitching}
              source={source}
              handStyle={handStyle}
              hubRef={hubRef}
              omitSeconds
            />
          </div>
        </div>
      </div>

      {/* Yellow seconds locked to the clock ring — never parented to the astronaut */}
      <SecondsOverlay dialRef={dialRef} time={time} source={source} handStyle={handStyle} />
      <AstronautFlyer hubRef={hubRef} p={p} />

      {/* Travel spacer — one scroll opens the scene */}
      <div className="relative mt-2 w-full" style={{ height: 'min(165vh, 1200px)' }}>
        {p < 0.35 && (
          <p className="pointer-events-none absolute bottom-10 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/25">
            Scroll — pull the hangar open
          </p>
        )}
      </div>

      <div
        className="mt-4 flex w-full flex-col items-center gap-8"
        style={{ opacity: isGlitching ? 0 : Math.max(0.12, smoothstep(0.55, 0.9, p)) }}
      >
        <HapticTimeManager time={time} />
        <FrequencyManager time={time} />
        <HandStyleSelect value={handStyle} />
        <div className="w-full">
          <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">Clock type</p>
          <ClockTypeSelect value={source} />
        </div>
        <ClockTimeLegend now={now} time={time} source={source} />
        <DayProgressBar time={time} />
        <LiveMoonPhaseCard />
        <AboutSection />
      </div>
    </div>
  );
}
