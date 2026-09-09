import { useEffect, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockDial from '@/components/younEEK/ClockDial';
import {
  formatDigital,
  readClockSource,
  readHandStyle,
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
  const [handStyle, setHandStyle] = useState(readHandStyle);

  useEffect(() => {
    document.documentElement.classList.add('watch-mode');
    const id = window.setInterval(() => setNow(new Date()), 50);
    const sync = () => {
      setSource(readClockSource());
      setDisplay(readWatchDisplay());
      setHandStyle(readHandStyle());
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
            className="text-[2.8rem] font-thin leading-none tracking-tight text-white"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {formatDigital(time, source).replace('•', ':')}
          </div>
          <div className="text-[11px] font-medium text-[#FF9F0A]">
            {sourceLabel(source)}
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-[220px] flex-col items-center gap-0.5">
          <div
            className="text-[1.45rem] font-thin leading-none tracking-tight text-white"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {formatDigital(time, source).replace('•', ':')}
          </div>
          <div className="w-[min(72vw,72vh)] max-w-[196px]">
            <ClockDial time={time} isGlitching={false} source={source} handStyle={handStyle} />
          </div>
        </div>
      )}
    </button>
  );
}
