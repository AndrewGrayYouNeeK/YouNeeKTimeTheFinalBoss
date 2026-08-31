import { useEffect, useState } from 'react';
import { YELLOW } from './clockConstants';
import { getHandRotations } from '@/lib/clockPrefs';

export default function SecondsOverlay({ dialRef, time, source, handStyle }) {
  const [box, setBox] = useState(null);
  const { second } = getHandRotations(time, source);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = dialRef?.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setBox({ left: r.left, top: r.top, width: r.width, height: r.height });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dialRef]);

  if (!box || box.width < 8) return null;

  const CX = 200;
  const CY = 200;
  const tick = Math.floor((((second % 360) + 360) % 360) / 6);
  const pulseAngle = tick * 6;
  const rad = ((pulseAngle - 90) * Math.PI) / 180;

  return (
    <div
      className="pointer-events-none fixed z-[40]"
      style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" className="h-full w-full" style={{ overflow: 'visible' }}>
        {handStyle === 'pulse' ? (
          <g>
            <line
              x1={CX + Math.cos(rad) * 186}
              y1={CY + Math.sin(rad) * 186}
              x2={CX + Math.cos(rad) * 198}
              y2={CY + Math.sin(rad) * 198}
              stroke={YELLOW}
              strokeWidth="4.5"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 10px ${YELLOW})` }}
            />
            <circle
              cx={CX + Math.cos(rad) * 198}
              cy={CY + Math.sin(rad) * 198}
              r="3"
              fill={YELLOW}
            />
          </g>
        ) : handStyle === 'comet' ? (
          <g>
            {(() => {
              const a = ((second - 90) * Math.PI) / 180;
              const r = 176;
              const x = CX + Math.cos(a) * r;
              const y = CY + Math.sin(a) * r;
              const tx = CX + Math.cos(a) * (r - 28);
              const ty = CY + Math.sin(a) * (r - 28);
              return (
                <>
                  <defs>
                    <linearGradient id="secCometTrail" x1={tx} y1={ty} x2={x} y2={y} gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={YELLOW} stopOpacity="0" />
                      <stop offset="100%" stopColor={YELLOW} stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <line x1={tx} y1={ty} x2={x} y2={y} stroke="url(#secCometTrail)" strokeWidth="3.2" strokeLinecap="round" />
                  <circle cx={x} cy={y} r="4.2" fill={YELLOW} style={{ filter: `drop-shadow(0 0 8px ${YELLOW})` }} />
                </>
              );
            })()}
          </g>
        ) : handStyle === 'ring' ? (
          <g transform={`rotate(${second} ${CX} ${CY})`}>
            <polygon
              points={`${CX},${CY - 178} ${CX - 5},${CY - 152} ${CX + 5},${CY - 152}`}
              fill={YELLOW}
              style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }}
            />
            <line x1={CX} y1={CY - 20} x2={CX} y2={CY - 152} stroke={YELLOW} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        ) : (
          <line
            x1={CX}
            y1={CY + 18}
            x2={CX}
            y2={CY - 168}
            stroke={YELLOW}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${second} ${CX} ${CY})`}
            style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }}
          />
        )}
        <circle cx={CX} cy={CY} r="2.4" fill={YELLOW} />
      </svg>
    </div>
  );
}
