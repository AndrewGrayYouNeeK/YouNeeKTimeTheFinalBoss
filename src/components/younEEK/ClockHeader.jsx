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

    bolts.forEach(bolt => {
      bolt.addEventListener('animationstart', handleAnimationStart);
      bolt.addEventListener('animationiteration', handleAnimationStart);
    });

    return () => {
      bolts.forEach(bolt => {
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
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feFlood floodColor="#fff" floodOpacity="0.5"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Left bolt - straight with large side branches */}
        <path className="bolt bolt-1" d="M180 15 L185 50 L180 100 L182 150 L175 200" filter="url(#glow)"/>
        <path className="bolt bolt-1 branch" d="M185 50 L210 55 L205 75" filter="url(#glow)"/>
        <path className="bolt bolt-1 branch" d="M180 100 L150 115 L145 140" filter="url(#glow)"/>
        <path className="bolt bolt-1 branch" d="M182 150 L165 175 L160 195" filter="url(#glow)"/>
        <path className="bolt bolt-1 branch" d="M180 100 L200 120 L210 145" filter="url(#glow)"/>

        {/* Center bolt - zigzag with many thin branches */}
        <path className="bolt bolt-2" d="M550 5 L545 35 L560 65 L535 95 L555 130 L540 160 L550 190" filter="url(#glow)"/>
        <path className="bolt bolt-2 branch" d="M545 35 L525 40 L520 55" filter="url(#glow)"/>
        <path className="bolt bolt-2 branch" d="M560 65 L585 70 L595 90" filter="url(#glow)"/>
        <path className="bolt bolt-2 branch" d="M535 95 L515 105 L510 125" filter="url(#glow)"/>
        <path className="bolt bolt-2 branch" d="M555 130 L575 140 L585 160" filter="url(#glow)"/>
        <path className="bolt bolt-2 branch" d="M540 160 L525 170 L530 185" filter="url(#glow)"/>

        {/* Right bolt - wide angular with thick lower branches */}
        <path className="bolt bolt-3" d="M920 25 L935 55 L915 90 L940 120 L920 155 L945 185 L925 200" filter="url(#glow)"/>
        <path className="bolt bolt-3 branch" d="M935 55 L965 50 L975 70" filter="url(#glow)"/>
        <path className="bolt bolt-3 branch" d="M915 90 L885 95 L875 115" filter="url(#glow)"/>
        <path className="bolt bolt-3 branch" d="M940 120 L970 130 L985 155" filter="url(#glow)"/>
        <path className="bolt bolt-3 branch" d="M920 155 L900 170 L895 190" filter="url(#glow)"/>
      </svg>
      <div className="text-center relative z-10 px-2">
        <p className="font-mono text-5xl sm:text-6xl uppercase tracking-[0.45em] text-black font-bold animate-lightning">YouNeeK Time</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-black font-bold animate-lightning">by Andrew Gray</p>

        <div className="mt-12 inline-grid grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-1 items-center justify-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-right">Regular Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-center">•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/30 text-left">{standardTime}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-right" style={{textShadow:'0 0 8px #1f990a99'}}>YouNeeK Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-center" style={{textShadow:'0 0 8px #1f990a99'}}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#1f990a] text-left" style={{textShadow:'0 0 8px #1f990a99'}}>{army12Str}</div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-right" style={{textShadow:'0 0 8px #2dd90099'}}>Army YouNeeK Time</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-center" style={{textShadow:'0 0 8px #2dd90099'}}>•</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2dd900] text-left" style={{textShadow:'0 0 8px #2dd90099'}}>{armyStr}</div>
        </div>
      </div>
    </div>
  );
}
