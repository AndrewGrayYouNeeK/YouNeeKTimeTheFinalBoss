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
import StickyFallAstronaut from '@/components/younEEK/StickyFallAstronaut';
import { PREFS_EVENT, readClockSource, readHandStyle } from '@/lib/clockPrefs';
import { getLunarDate } from '@/lib/lunarCalendar';
import TimeScope from '@/components/TimeScope';
import AppPanel from '@/components/AppPanel';
import AshCoalOverlay from '@/components/landing/AshCoalOverlay';
import useYouNeekHourEruption from '@/hooks/useYouNeekHourEruption';

function formatLocalLine(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'shortOffset',
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value || '';
  const hour = get('hour');
  const minute = get('minute');
  const dayPeriod = get('dayPeriod');
  const tz = get('timeZoneName') || 'UTC-6';
  return `• ${hour}:${minute} ${dayPeriod} ${tz}`;
}

export default function YouNeekClock() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const lunar = useMemo(
    () => getLunarDate(now),
    [now.getFullYear(), now.getMonth(), now.getDate()],
  );
  const [source, setSource] = useState(readClockSource);
  const [handStyle, setHandStyle] = useState(readHandStyle);
  const [scopeOn, setScopeOn] = useState(false);
  const dialRef = useRef(null);
  const { erupting } = useYouNeekHourEruption();

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

  return (
    <div className="relative flex w-full flex-col items-center gap-5 sm:gap-6">
      {/* Hourly ash across the whole screen; volcano smoke lives inside the dial */}
      <AshCoalOverlay active={erupting} />
      <StickyFallAstronaut dialRef={dialRef} />

      <ClockHeader />

      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
        {formatLocalLine(now)}
      </p>

      <div className="flex w-full overflow-hidden rounded-2xl border border-white/10 font-mono text-[10px] uppercase tracking-[0.25em]">
        <button
          type="button"
          onClick={() => setScopeOn(true)}
          className={`flex-1 py-2.5 ${scopeOn ? 'bg-[#7CFF6B] text-black' : 'text-white/45'}`}
        >
          TIME SCOPE
        </button>
        <button
          type="button"
          onClick={() => setScopeOn(false)}
          className={`flex-1 py-2.5 ${scopeOn ? 'text-white/45' : 'bg-[#7CFF6B] text-black'}`}
        >
          FACE
        </button>
      </div>

      {scopeOn ? (
        <AppPanel className="!p-4 w-full">
          <TimeScope />
        </AppPanel>
      ) : (
        <>
          {/* Digital ABOVE the dial — reference layout */}
          <DigitalTimeDisplay time={time} source={source} />

          <div className="w-full">
            <ClockDial
              ref={dialRef}
              time={time}
              isGlitching={false}
              source={source}
              handStyle={handStyle}
              lunar={lunar}
              erupting={erupting}
            />
          </div>

          <div className="w-full px-1">
            <DayProgressBar time={time} />
          </div>
        </>
      )}

      <AppPanel className="text-center w-full">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7CFF6B]">Lunar date</p>
        <p className="mt-2 text-[13px] text-white/75">{lunar.longLabel}</p>
        <p className="mt-1 text-[12px] text-white/40">
          {lunar.phase} · {lunar.illumination}%
        </p>
      </AppPanel>

      <LiveMoonPhaseCard />

      {!scopeOn && (
        <AppPanel className="flex w-full flex-col gap-5">
          <ClockTypeSelect value={source} />
          <HandStyleSelect value={handStyle} />
          <ClockTimeLegend now={now} time={time} source={source} lunar={lunar} />
        </AppPanel>
      )}

      <AppPanel className="w-full">
        <HapticTimeManager time={time} />
        <FrequencyManager time={time} />
      </AppPanel>

      <AboutSection />
    </div>
  );
}
