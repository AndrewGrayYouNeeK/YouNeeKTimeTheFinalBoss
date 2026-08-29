import { useEffect, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockDial from '@/components/younEEK/ClockDial';
import { LAVA } from '@/components/younEEK/clockConstants';
import {
  formatDigital,
  readClockSource,
  readWatchDisplay,
  writeWatchDisplay,
  sourceLabel,
  PREFS_EVENT,
} from '@/lib/clockPrefs';

export default function Watch() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const [source, setSource] = useState(readClockSource);
  const [display, setDisplay] = useState(readWatchDisplay);

  useEffect(() => {
    document.documentElement.classList.add('watch-mode');
    const id = window.setInterval(() => setNow(new Date()), 50);
    const sync = () => {
      setSource(readClockSource());
      setDisplay(readWatchDisplay());
    };
    window.addEventListener(PREFS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      document.documentElement.classList.remove('watch-mode');
      window.clearInterval(id);
      window.removeEventListener(PREFS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleDisplay = () => {
    const next = display === 'face' ? 'decimal' : 'face';
    setDisplay(next);
    writeWatchDisplay(next);
  };

  return (
    <button
      type="button"
      onClick={toggleDisplay}
      className="watch-face flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black text-white"
    >
      {display === 'decimal' ? (
        <div className="flex flex-col items-center gap-2 px-3">
          <div
            className="font-mono text-[2.6rem] font-semibold leading-none tracking-[0.08em]"
            style={{ color: LAVA, textShadow: `0 0 16px ${LAVA}` }}
          >
            {formatDigital(time, source)}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
            {sourceLabel(source)}
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-[220px] flex-col items-center gap-0.5">
          <div
            className="font-mono text-[1.45rem] font-semibold leading-none tracking-[0.12em]"
            style={{ color: LAVA, textShadow: `0 0 12px ${LAVA}` }}
          >
            {formatDigital(time, source)}
          </div>
          <div className="w-[min(72vw,72vh)] max-w-[196px]">
            <ClockDial time={time} isGlitching={false} source={source} />
          </div>
        </div>
      )}
    </button>
  );
}
