import { useEffect, useMemo, useState } from 'react';
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
import AppPanel from '@/components/AppPanel';

export default function YouNeekClock() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const lunar = useMemo(
    () => getLunarDate(now),
    [now.getFullYear(), now.getMonth(), now.getDate()],
  );
  const [source, setSource] = useState(readClockSource);
  const [handStyle, setHandStyle] = useState(readHandStyle);
  const [scopeOn, setScopeOn] = useState(true);

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
    <div className="flex w-full flex-col items-center gap-6">
      <ClockHeader />

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

      <AppPanel className="!p-4">
        {scopeOn ? <TimeScope /> : <DigitalTimeDisplay time={time} source={source} />}
      </AppPanel>

      <AppPanel className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7CFF6B]">Lunar date</p>
        <p className="mt-2 text-[13px] text-white/75">{lunar.longLabel}</p>
        <p className="mt-1 text-[12px] text-white/40">
          {lunar.phase} · {lunar.illumination}%
        </p>
      </AppPanel>

      <AppPanel>
        <HapticTimeManager time={time} />
        <FrequencyManager time={time} />
      </AppPanel>

      {!scopeOn && (
        <AppPanel className="flex flex-col gap-5">
          <ClockTypeSelect value={source} />
          <HandStyleSelect value={handStyle} />
          <ClockTimeLegend now={now} time={time} source={source} lunar={lunar} />
          <ClockDial time={time} isGlitching={false} source={source} handStyle={handStyle} lunar={lunar} />
        </AppPanel>
      )}

      <AppPanel>
        <DayProgressBar time={time} />
      </AppPanel>
      <LiveMoonPhaseCard />
      <AboutSection />
    </div>
  );
}
