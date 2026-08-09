import { useEffect, useRef } from 'react';
import { triggerSingle, triggerConfirm } from '@/lib/haptics';

function pad(v) { return String(v).padStart(2, '0'); }

export default function ClockHeader({ now, time }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const bolts = headerRef.current?.querySelectorAll('.bolt-main');
    if (!bolts?.length) return;

    const handleAnimationStart = () => {
      triggerSingle();
      setTimeout(() => triggerConfirm(), 80);
    };

    bolts.forEach((bolt) => {
      bolt.addEventListener('animationstart', handleAnimationStart);
      bolt.addEventListener('animationiteration', handleAnimationStart);
    });

    return () => {
      bolts.forEach((bolt) => {
        bolt.removeEventListener('animationstart', handleAnimationStart);
        bolt.removeEventListener('animationiteration', handleAnimationStart);
      });
    };
  }, []);

  const standardTime = `${pad(time.hours12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const armyStr = `${pad(time.armyHours)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;
  const army12Str = `${pad(time.hours12)}:${pad(time.armyMinutes)}:${pad(time.armySeconds)}`;

  return (
    <div className="header relative" ref={headerRef}>
      <svg className="lightning-bg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="bolt-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#ffffff" floodOpacity="0.85" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bolt-glow-green" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#39ff14" floodOpacity="0.7" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="bolt bolt-main bolt-1" d="M180 15 L185 50 L180 100 L182 150 L175 200" filter="url(#bolt-glow)" />
        <path className="bolt bolt-1 branch" d="M185 50 L210 55 L205 75" filter="url(#bolt-glow)" />
        <path className="bolt bolt-1 branch" d="M180 100 L150 115 L145 140" filter="url(#bolt-glow)" />
        <path className="bolt bolt-1 branch" d="M182 150 L165 175 L160 195" filter="url(#bolt-glow)" />

        <path className="bolt bolt-main bolt-2" d="M550 5 L545 35 L560 65 L535 95 L555 130 L540 160 L550 190" filter="url(#bolt-glow-green)" />
        <path className="bolt bolt-2 branch" d="M545 35 L525 40 L520 55" filter="url(#bolt-glow-green)" />
        <path className="bolt bolt-2 branch" d="M560 65 L585 70 L595 90" filter="url(#bolt-glow-green)" />
        <path className="bolt bolt-2 branch" d="M535 95 L515 105 L510 125" filter="url(#bolt-glow-green)" />
        <path className="bolt bolt-2 branch" d="M555 130 L575 140 L585 160" filter="url(#bolt-glow-green)" />

        <path className="bolt bolt-main bolt-3" d="M920 25 L935 55 L915 90 L940 120 L920 155 L945 185 L925 200" filter="url(#bolt-glow)" />
        <path className="bolt bolt-3 branch" d="M935 55 L965 50 L975 70" filter="url(#bolt-glow)" />
        <path className="bolt bolt-3 branch" d="M915 90 L885 95 L875 115" filter="url(#bolt-glow)" />
        <path className="bolt bolt-3 branch" d="M940 120 L970 130 L985 155" filter="url(#bolt-glow)" />
      </svg>

      <div className="header-copy text-center relative z-10 px-2">
        <div className="header-title-wrap mx-auto">
          <p className="header-title-glow font-mono text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.35em] sm:tracking-[0.45em] font-bold" aria-hidden="true">
            YouNeeK Time
          </p>
          <p className="header-title font-mono text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.35em] sm:tracking-[0.45em] font-bold">
            YouNeeK Time
          </p>
        </div>
        <div className="header-subtitle-wrap mx-auto mt-3">
          <p className="header-subtitle-glow font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold" aria-hidden="true">
            by Andrew Gray
          </p>
          <p className="header-subtitle font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold">
            by Andrew Gray
          </p>
        </div>

        <div className="mt-10 sm:mt-12 inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-right">Regular Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-center">•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-left">{standardTime}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-right" style={{ textShadow: '0 0 8px #1f990a99' }}>YouNeeK Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-center" style={{ textShadow: '0 0 8px #1f990a99' }}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-left" style={{ textShadow: '0 0 8px #1f990a99' }}>{army12Str}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-right" style={{ textShadow: '0 0 8px #2dd90099' }}>Army YouNeeK Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-center" style={{ textShadow: '0 0 8px #2dd90099' }}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-left" style={{ textShadow: '0 0 8px #2dd90099' }}>{armyStr}</div>
        </div>
      </div>
    </div>
  );
}
