import { GREEN, RED, RING_GRAY } from './clockConstants';

const OUTER_TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const isMajor = i % 3 === 0;
  const outerR = 199;
  const innerR = isMajor ? 178 : 188;
  return {
    x1: 200 + Math.cos(angle) * outerR,
    y1: 200 + Math.sin(angle) * outerR,
    x2: 200 + Math.cos(angle) * innerR,
    y2: 200 + Math.sin(angle) * innerR,
    strokeWidth: isMajor ? 2.8 : 1.1,
    key: `outer-${i}`,
  };
});

const INNER_TICKS = Array.from({ length: 100 }, (_, i) => {
  const angle = (i / 100) * Math.PI * 2 - Math.PI / 2;
  const isMajor = i % 10 === 0;
  const isMid = i % 5 === 0;
  const innerR = isMajor ? 146 : isMid ? 151 : 153;
  const outerR = 160;
  return {
    x1: 200 + Math.cos(angle) * innerR,
    y1: 200 + Math.sin(angle) * innerR,
    x2: 200 + Math.cos(angle) * outerR,
    y2: 200 + Math.sin(angle) * outerR,
    strokeWidth: isMajor ? 2 : isMid ? 1.1 : 0.55,
    key: `inner-${i}`,
  };
});

export default function ClockTicks() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full z-20 pointer-events-none">
      <circle cx="200" cy="200" r="199" stroke={RING_GRAY} strokeWidth="2.2" fill="none" />

      <circle cx="200" cy="200" r="160" stroke={RING_GRAY} strokeWidth="1.6" fill="none" />

      {OUTER_TICKS.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={GREEN}
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${GREEN}66)` }}
        />
      ))}

      {INNER_TICKS.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={RED}
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
          opacity={t.strokeWidth < 1 ? 0.75 : 0.95}
        />
      ))}
    </svg>
  );
}
