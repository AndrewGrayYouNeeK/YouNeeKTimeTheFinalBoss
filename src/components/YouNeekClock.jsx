import { useEffect, useMemo, useRef, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockHeader from '@/components/younEEK/ClockHeader';
import DigitalTimeDisplay from '@/components/younEEK/DigitalTimeDisplay';
import ClockTimeLegend from '@/components/younEEK/ClockTimeLegend';
import ClockDial from '@/components/younEEK/ClockDial';
import ClockTypeSelect from '@/components/younEEK/ClockTypeSelect';
import DayProgressBar from '@/components/younEEK/DayProgressBar';
import HapticTimeManager from '@/components/younEEK/HapticTimeManager';
import FrequencyManager from '@/components/younEEK/FrequencyManager';
import LiveMoonPhaseCard from '@/components/younEEK/LiveMoonPhaseCard';
import AboutSection from '@/components/younEEK/AboutSection';
import HandStyleSelect from '@/components/younEEK/HandStyleSelect';
import { PREFS_EVENT, readClockSource, readHandStyle } from '@/lib/clockPrefs';
import { getLunarDate } from '@/lib/lunarCalendar';
import TimeScope from '@/components/TimeScope';

export default function YouNeekClock() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const lunar = useMemo(
    () => getLunarDate(now),
    [now.getFullYear(), now.getMonth(), now.getDate()],
  );
  const [isGlitching, setIsGlitching] = useState(false);
  const [source, setSource] = useState(readClockSource);
  const [handStyle, setHandStyle] = useState(readHandStyle);
  const [scopeOn, setScopeOn] = useState(true);
  const hour = now.getHours();
  const skipGlitch = useRef(true);

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
    <div
      className={`mx-auto flex min-h-screen w-full max-w-[36rem] flex-col items-center gap-7 px-4 pb-28 pt-6 sm:gap-8 ${isGlitching ? 'bg-black' : 'bg-black'}`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <ClockHeader />
      <div className="flex w-full overflow-hidden rounded border border-[#7CFF6B]/30 font-mono text-[10px] uppercase tracking-[0.25em]">
        <button
          type="button"
          onClick={() => setScopeOn(true)}
          className={`flex-1 py-2 ${scopeOn ? 'bg-[#7CFF6B] text-[#050805]' : 'text-[#7CFF6B]/70'}`}
        >
          TIME SCOPE
        </button>
        <button
          type="button"
          onClick={() => setScopeOn(false)}
          className={`flex-1 py-2 ${scopeOn ? 'text-white/40' : 'bg-white/10 text-white'}`}
        >
          FACE
        </button>
      </div>
      {scopeOn ? (
        <TimeScope />
      ) : (
        <DigitalTimeDisplay time={time} source={source} />
      )}
      <p className="text-center text-[13px] text-white/45">
        {lunar.longLabel}
      </p>
      <p className="text-center text-[12px] text-white/35">
        {lunar.phase} · {lunar.illumination}% · in-app YouNeeK time
      </p>
      <HapticTimeManager time={time} />
      <FrequencyManager time={time} />
      {!scopeOn && (
        <div className={`w-full overflow-visible ${isGlitching ? 'animate-glitch' : ''}`}>
          <ClockTypeSelect value={source} />
          <div className="mt-4">
            <HandStyleSelect value={handStyle} />
          </div>
          <div className="mt-5">
            <ClockTimeLegend now={now} time={time} source={source} lunar={lunar} />
          </div>
          <ClockDial time={time} isGlitching={isGlitching} source={source} handStyle={handStyle} lunar={lunar} />
        </div>
      )}
      <DayProgressBar time={time} />
      <LiveMoonPhaseCard />
      <AboutSection />
    </div>
  );
}
