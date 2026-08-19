import { useEffect, useRef, useState } from 'react';
import { getDecimalTime } from '@/lib/decimalTime';
import ClockHeader from '@/components/younEEK/ClockHeader';
import DigitalTimeDisplay from '@/components/younEEK/DigitalTimeDisplay';
import ClockTimeLegend from '@/components/younEEK/ClockTimeLegend';
import ClockDial from '@/components/younEEK/ClockDial';
import DayProgressBar from '@/components/younEEK/DayProgressBar';
import HapticTimeManager from '@/components/younEEK/HapticTimeManager';
import FrequencyManager from '@/components/younEEK/FrequencyManager';
import LiveMoonPhaseCard from '@/components/younEEK/LiveMoonPhaseCard';
import AboutSection from '@/components/younEEK/AboutSection';

export default function YouNeekClock() {
  const [now, setNow] = useState(() => new Date());
  const time = getDecimalTime(now);
  const [isGlitching, setIsGlitching] = useState(false);
  const hour = now.getHours();
  const skipGlitch = useRef(true);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 16);
    return () => window.clearInterval(id);
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
    <div className={`mx-auto flex min-h-screen w-full max-w-[36rem] flex-col items-center gap-8 px-4 py-8 sm:gap-9 sm:py-10 transition-colors duration-100 ${isGlitching ? 'bg-black' : 'bg-transparent'}`}>
      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <ClockHeader />
      </div>
      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <DigitalTimeDisplay time={time} />
      </div>
      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <HapticTimeManager time={time} />
        <FrequencyManager time={time} />
      </div>
      <div className={`w-full overflow-visible ${isGlitching ? 'animate-glitch' : ''}`}>
        <ClockTimeLegend now={now} time={time} />
        <ClockDial time={time} isGlitching={isGlitching} />
      </div>

      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <DayProgressBar time={time} />
      </div>
      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <LiveMoonPhaseCard />
      </div>
      <div className={`w-full transition-opacity duration-100 ${isGlitching ? 'opacity-0' : ''}`}>
        <AboutSection />
      </div>
    </div>
  );
}