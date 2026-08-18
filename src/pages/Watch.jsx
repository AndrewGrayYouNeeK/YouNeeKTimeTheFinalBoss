import { useEffect, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockDial from '@/components/younEEK/ClockDial';
import { GREEN } from '@/components/younEEK/clockConstants';

function pad(value) {
  return String(value).padStart(2, '0');
}

export default function Watch() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);

  useEffect(() => {
    document.documentElement.classList.add('watch-mode');
    const id = window.setInterval(() => setNow(new Date()), 50);
    return () => {
      document.documentElement.classList.remove('watch-mode');
      window.clearInterval(id);
    };
  }, []);

  const units = pad(time.units);
  const minutes = pad(time.minutes);

  return (
    <div className="watch-face flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="flex w-full max-w-[220px] flex-col items-center gap-1">
        <div
          className="font-mono text-[1.65rem] font-semibold leading-none tracking-[0.12em]"
          style={{ color: GREEN, textShadow: `0 0 12px ${GREEN}` }}
        >
          {units}
          <span className="px-0.5 opacity-80">•</span>
          {minutes}
        </div>
        <div className="w-[min(72vw,72vh)] max-w-[196px]">
          <ClockDial time={time} isGlitching={false} />
        </div>
        <div
          className="h-1 w-[70%] overflow-hidden rounded-full"
          style={{ background: `${GREEN}22` }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${time.progress * 100}%`, background: GREEN, boxShadow: `0 0 8px ${GREEN}` }}
          />
        </div>
      </div>
    </div>
  );
}
