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

export default function YouNeekClock({ launch = 0 }) {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const [isGlitching, setIsGlitching] = useState(false);
  const [source, setSource] = useState(readClockSource);
  const [handStyle, setHandStyle] = useState(readHandStyle);
  const hour = now.getHours();
  const skipGlitch = useRef(true);
  const hubRef = useRef(null);
  const landRef = useRef(null);
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
    if (skipGlitch.current) {
      skipGlitch.current = false;
      return;
    }
    setIsGlitching(true);
    const glitchTimer = setTimeout(() => setIsGlitching(false), 3000);
    return () => clearTimeout(glitchTimer);
  }, [hour]);

  return (
    <div className={`mx-auto flex w-full max-w-[36rem] flex-col items-center px-4 pb-28 transition-colors duration-100 ${isGlitching ? 'bg-black' : 'bg-transparent'}`}>
      <div className="clock-sticky w-full">
        <div className={`flex w-full flex-col items-center gap-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#00b7ff]/70">YouNeeK Time</p>
          <div
            className="font-mono text-4xl font-semibold tracking-[0.14em] sm:text-5xl"
            style={{ color: '#ffe600' }}
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
              showHubAstronaut={launch < 0.03}
            />
          </div>
        </div>
      </div>

      <SecondsOverlay dialRef={dialRef} time={time} source={source} handStyle={handStyle} />
      <AstronautFlyer hubRef={hubRef} launch={launch} />

      <div className="relative mt-2 w-full" style={{ height: 'min(120vh, 920px)' }}>
        <div
          ref={landRef}
          className="absolute left-1/2 top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <p className="pointer-events-none absolute bottom-10 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/25">
          Scroll — astronaut launches into the scene
        </p>
      </div>

      <div className={`mt-4 flex w-full flex-col items-center gap-8 transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
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
