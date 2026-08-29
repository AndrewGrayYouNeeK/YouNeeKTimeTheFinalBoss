import { LAVA_DEEP, GOLD, fadeLavaMirror } from './clockConstants';

// Outer ring: 0-100 units, majors every 10
const OUTER_TICKS = Array.from({ length: 100 }, (_, i) => {
  const angle = (i / 100) * Math.PI * 2 - Math.PI / 2;
  const isMajor = i % 10 === 0;
  const outerR = 198;
  const innerR = isMajor ? 183 : 191;
  return {
    x1: 200 + Math.cos(angle) * outerR,
    y1: 200 + Math.sin(angle) * outerR,
    x2: 200 + Math.cos(angle) * innerR,
    y2: 200 + Math.sin(angle) * innerR,
    strokeWidth: isMajor ? 4 : 1.4,
    isMajor,
    color: fadeLavaMirror(i / 100),
    key: `outer-${i}`,
  };
});

// Inner ring: 0-24 hours, majors every 3
const INNER_TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
  const isMajor = i % 3 === 0;
  const innerR = isMajor ? 149 : 155;
  const outerR = 162;
  return {
    x1: 200 + Math.cos(angle) * innerR,
    y1: 200 + Math.sin(angle) * innerR,
    x2: 200 + Math.cos(angle) * outerR,
    y2: 200 + Math.sin(angle) * outerR,
    strokeWidth: isMajor ? 3.4 : 1.6,
    isMajor,
    color: fadeLavaMirror(i / 24),
    key: `inner-${i}`,
  };
});

export default function ClockTicks() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full z-20 pointer-events-none">
      <defs>
        <linearGradient id="ringFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={LAVA_DEEP} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="172.5" stroke="black" strokeWidth="22" fill="none" />

      <circle
        cx="200"
        cy="200"
        r="162"
        stroke="url(#ringFade)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="4 5"
        style={{ filter: `drop-shadow(0 0 3px ${LAVA_DEEP}aa)` }}
      />

      <circle
        cx="200"
        cy="200"
        r="199"
        stroke="url(#ringFade)"
        strokeWidth="1.4"
        fill="none"
        style={{ filter: `drop-shadow(0 0 5px ${GOLD}) drop-shadow(0 0 10px ${LAVA_DEEP}66)` }}
      />

      {OUTER_TICKS.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
          style={{
            filter: t.isMajor
              ? `drop-shadow(0 0 4px ${t.color}) drop-shadow(0 0 9px ${t.color}aa)`
              : `drop-shadow(0 0 3px ${t.color}88)`,
          }}
        />
      ))}

      {INNER_TICKS.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
          style={{
            filter: t.isMajor
              ? `drop-shadow(0 0 4px ${t.color}) drop-shadow(0 0 8px ${t.color}88)`
              : `drop-shadow(0 0 2px ${t.color}66)`,
          }}
        />
      ))}
    </svg>
  );
}
