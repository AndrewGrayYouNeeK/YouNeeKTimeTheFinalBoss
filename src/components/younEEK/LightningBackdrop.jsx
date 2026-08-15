import { useEffect, useRef } from 'react';
import { triggerSingle, triggerConfirm } from '@/lib/haptics';

export default function LightningBackdrop() {
  const layerRef = useRef(null);

  useEffect(() => {
    const bolts = layerRef.current?.querySelectorAll('.bolt:not(.branch)');
    if (!bolts?.length) return;

    const onStrike = () => {
      triggerSingle();
      setTimeout(() => triggerConfirm(), 80);
    };

    bolts.forEach((bolt) => {
      bolt.addEventListener('animationstart', onStrike);
      bolt.addEventListener('animationiteration', onStrike);
    });

    return () => {
      bolts.forEach((bolt) => {
        bolt.removeEventListener('animationstart', onStrike);
        bolt.removeEventListener('animationiteration', onStrike);
      });
    };
  }, []);

  return (
    <div ref={layerRef} className="lightning-backdrop" aria-hidden="true">
      <svg className="lightning-bg" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="bolt-glow-phosphor" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#4ade80" floodOpacity="0.85" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bolt-glow-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#39ff14" floodOpacity="0.9" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="bolt-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#22d3ee" floodOpacity="0.75" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="bolt bolt-1" d="M180 15 L185 50 L180 100 L182 150 L175 200" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M185 50 L210 55 L205 75" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M180 100 L150 115 L145 140" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M182 150 L165 175 L160 195" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M180 100 L200 120 L210 145" filter="url(#bolt-glow-phosphor)" />

        <path className="bolt bolt-2" d="M550 5 L545 35 L560 65 L535 95 L555 130 L540 160 L550 190" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M545 35 L525 40 L520 55" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M560 65 L585 70 L595 90" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M535 95 L515 105 L510 125" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M555 130 L575 140 L585 160" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M540 160 L525 170 L530 185" filter="url(#bolt-glow-core)" />

        <path className="bolt bolt-3" d="M920 25 L935 55 L915 90 L940 120 L920 155 L945 185 L925 200" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M935 55 L965 50 L975 70" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M915 90 L885 95 L875 115" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M940 120 L970 130 L985 155" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M920 155 L900 170 L895 190" filter="url(#bolt-glow-cyan)" />
      </svg>
      <div className="lightning-sky-flash" />
    </div>
  );
}
