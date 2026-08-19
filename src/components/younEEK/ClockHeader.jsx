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
          <filter id="bolt-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#ffffff" floodOpacity="0.8"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="bolt-glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur"/>
            <feFlood floodColor="#39ff14" floodOpacity="0.6"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path className="bolt bolt-main bolt-1" d="M 160 0 L 175 35 L 165 70 L 180 105 L 168 145 L 175 200" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-1 branch" d="M 175 35 L 210 42 L 225 65" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-1 branch" d="M 165 70 L 130 85 L 115 110" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-1 branch" d="M 180 105 L 205 125 L 220 155" filter="url(#bolt-glow)"/>

        <path className="bolt bolt-main bolt-2" d="M 580 0 L 565 30 L 590 55 L 555 85 L 575 115 L 548 150 L 570 185 L 560 200" filter="url(#bolt-glow-green)"/>
        <path className="bolt bolt-2 branch" d="M 565 30 L 535 38 L 520 58" filter="url(#bolt-glow-green)"/>
        <path className="bolt bolt-2 branch" d="M 590 55 L 620 62 L 635 88" filter="url(#bolt-glow-green)"/>
        <path className="bolt bolt-2 branch" d="M 555 85 L 525 98 L 510 120" filter="url(#bolt-glow-green)"/>
        <path className="bolt bolt-2 branch" d="M 575 115 L 605 128 L 625 155" filter="url(#bolt-glow-green)"/>
        <path className="bolt bolt-2 branch" d="M 548 150 L 530 168 L 540 190" filter="url(#bolt-glow-green)"/>

        <path className="bolt bolt-main bolt-3" d="M 940 10 L 955 45 L 930 80 L 960 110 L 935 150 L 965 185 L 940 200" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-3 branch" d="M 955 45 L 990 50 L 1005 72" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-3 branch" d="M 930 80 L 895 92 L 880 115" filter="url(#bolt-glow)"/>
        <path className="bolt bolt-3 branch" d="M 960 110 L 990 125 L 1010 150" filter="url(#bolt-glow)"/>
      </svg>

      <div className="relative z-10 flex w-full flex-col items-center px-2">
        <div className="header-title-reveal header-title-panel w-full max-w-lg">
          <p className="font-mono text-3xl sm:text-4xl uppercase tracking-[0.12em] font-bold lightning-reveal-title text-center leading-tight">
            YouNeeK Time
          </p>
          <p className="mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] font-bold lightning-reveal-subtitle text-center">
            by Andrew Gray
          </p>
        </div>

        <div className="mt-6 w-full max-w-sm space-y-2 font-mono text-[11px] uppercase tracking-widest">
          <div className="flex items-center justify-between gap-3 text-white/70">
            <span>Regular Time</span>
            <span>{standardTime}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#1f990a]" style={{ textShadow: '0 0 8px #1f990a99' }}>
            <span>YouNeeK Time</span>
            <span>{army12Str}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#2dd900]" style={{ textShadow: '0 0 8px #2dd90099' }}>
            <span>Army YouNeeK Time</span>
            <span>{armyStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
