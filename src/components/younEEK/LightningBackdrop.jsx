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
      <svg className="lightning-bg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
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

        <path className="bolt bolt-1" d="M180 20 L195 90 L185 180 L200 270 L188 390 L195 520" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M195 90 L240 100 L235 140" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M185 180 L140 200 L125 250" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M200 270 L175 320 L165 380" filter="url(#bolt-glow-phosphor)" />
        <path className="bolt bolt-1 branch" d="M185 180 L220 220 L235 280" filter="url(#bolt-glow-phosphor)" />

        <path className="bolt bolt-2" d="M600 10 L585 70 L610 130 L555 190 L580 280 L545 400 L570 520" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M585 70 L545 80 L530 110" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M610 130 L660 140 L680 190" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M555 190 L515 210 L500 260" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M580 280 L620 300 L640 360" filter="url(#bolt-glow-core)" />
        <path className="bolt bolt-2 branch" d="M545 400 L525 430 L535 480" filter="url(#bolt-glow-core)" />

        <path className="bolt bolt-3" d="M1020 40 L1045 110 L1015 180 L1050 250 L1025 340 L1060 430 L1035 520" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M1045 110 L1090 100 L1110 140" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M1015 180 L960 190 L940 240" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M1050 250 L1100 270 L1120 320" filter="url(#bolt-glow-cyan)" />
        <path className="bolt bolt-3 branch" d="M1025 340 L990 370 L980 420" filter="url(#bolt-glow-cyan)" />
      </svg>

    </div>
  );
}
