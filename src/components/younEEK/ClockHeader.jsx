import { useEffect, useRef } from 'react';
import { triggerSingle, triggerConfirm } from '@/lib/haptics';

function pad(v) { return String(v).padStart(2, '0'); }

export default function ClockHeader({ now, time }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const bolts = headerRef.current?.querySelectorAll('.bolt:not(.branch)');
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
    <div className="header relative w-full" ref={headerRef}>
      <svg className="lightning-bg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#fff" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="bolt bolt-1" d="M180 15 L185 50 L180 100 L182 150 L175 200" filter="url(#glow)" />
        <path className="bolt bolt-1 branch" d="M185 50 L210 55 L205 75" filter="url(#glow)" />
        <path className="bolt bolt-1 branch" d="M180 100 L150 115 L145 140" filter="url(#glow)" />
        <path className="bolt bolt-1 branch" d="M182 150 L165 175 L160 195" filter="url(#glow)" />
        <path className="bolt bolt-1 branch" d="M180 100 L200 120 L210 145" filter="url(#glow)" />

        <path className="bolt bolt-2" d="M550 5 L545 35 L560 65 L535 95 L555 130 L540 160 L550 190" filter="url(#glow)" />
        <path className="bolt bolt-2 branch" d="M545 35 L525 40 L520 55" filter="url(#glow)" />
        <path className="bolt bolt-2 branch" d="M560 65 L585 70 L595 90" filter="url(#glow)" />
        <path className="bolt bolt-2 branch" d="M535 95 L515 105 L510 125" filter="url(#glow)" />
        <path className="bolt bolt-2 branch" d="M555 130 L575 140 L585 160" filter="url(#glow)" />
        <path className="bolt bolt-2 branch" d="M540 160 L525 170 L530 185" filter="url(#glow)" />

        <path className="bolt bolt-3" d="M920 25 L935 55 L915 90 L940 120 L920 155 L945 185 L925 200" filter="url(#glow)" />
        <path className="bolt bolt-3 branch" d="M935 55 L965 50 L975 70" filter="url(#glow)" />
        <path className="bolt bolt-3 branch" d="M915 90 L885 95 L875 115" filter="url(#glow)" />
        <path className="bolt bolt-3 branch" d="M940 120 L970 130 L985 155" filter="url(#glow)" />
        <path className="bolt bolt-3 branch" d="M920 155 L900 170 L895 190" filter="url(#glow)" />
      </svg>

      <div className="header-content relative z-10 w-full px-2 sm:px-3">
        <div className="header-silhouette mx-auto">
          <div className="header-backlight" aria-hidden="true" />
          <div className="header-line">
            <p className="header-shadow header-title-text font-mono uppercase font-bold" aria-hidden="true">
              YouNeeK Time
            </p>
            <p className="header-title header-title-text font-mono uppercase font-bold">
              YouNeeK Time
            </p>
          </div>
          <div className="header-line mt-2 sm:mt-3">
            <p className="header-shadow header-subtitle-text font-mono uppercase font-bold" aria-hidden="true">
              by Andrew Gray
            </p>
            <p className="header-subtitle header-subtitle-text font-mono uppercase font-bold">
              by Andrew Gray
            </p>
          </div>
        </div>

        <div className="header-times mx-auto mt-8 sm:mt-10">
          <div className="header-time-row">
            <span className="header-time-label text-white/30">Regular Time</span>
            <span className="header-time-dot text-white/30">•</span>
            <span className="header-time-value text-white/30">{standardTime}</span>
          </div>
          <div className="header-time-row">
            <span className="header-time-label text-[#1f990a]" style={{ textShadow: '0 0 8px #1f990a99' }}>YouNeeK Time</span>
            <span className="header-time-dot text-[#1f990a]" style={{ textShadow: '0 0 8px #1f990a99' }}>•</span>
            <span className="header-time-value text-[#1f990a]" style={{ textShadow: '0 0 8px #1f990a99' }}>{army12Str}</span>
          </div>
          <div className="header-time-row">
            <span className="header-time-label text-[#2dd900]" style={{ textShadow: '0 0 8px #2dd90099' }}>Army YouNeeK Time</span>
            <span className="header-time-dot text-[#2dd900]" style={{ textShadow: '0 0 8px #2dd90099' }}>•</span>
            <span className="header-time-value text-[#2dd900]" style={{ textShadow: '0 0 8px #2dd90099' }}>{armyStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
