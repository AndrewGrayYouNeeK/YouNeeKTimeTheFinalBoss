import { dialFace } from '@/lib/clockPrefs';

const HOUR_MARK = '#3d9eff';
const MIN_MARK = '#c026ff';
const FIVE_MARK = '#d58bff';

function polar(radius, angle) {
  return {
    x: 200 + Math.cos(angle) * radius,
    y: 200 + Math.sin(angle) * radius,
  };
}

function tickAt(angle, innerR, strokeWidth, color, key) {
  const outer = polar(197, angle);
  const inner = polar(innerR, angle);
  return {
    x1: outer.x,
    y1: outer.y,
    x2: inner.x,
    y2: inner.y,
    strokeWidth,
    color,
    key,
  };
}

function buildTicks(source) {
  const twelve = dialFace(source) === 'twelve';
  const count = 100;
  const ticks = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const isCardinal = i % 25 === 0;
    const isTen = i % 10 === 0;
    const isFive = i % 5 === 0;
    const innerR = isCardinal ? 176 : isTen ? 180 : isFive ? 184 : 192;
    const strokeWidth = isCardinal ? 3.3 : isTen ? 2.6 : isFive ? 2.4 : 1;
    const color = isCardinal ? HOUR_MARK : isFive ? FIVE_MARK : MIN_MARK;
    return tickAt(angle, innerR, strokeWidth, color, `rim-${source}-${i}`);
  });
  if (twelve) {
    for (let hour = 0; hour < 12; hour += 1) {
      const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
      ticks.push(tickAt(angle, 170, 3.6, HOUR_MARK, `hour-${hour}`));
    }
  }
  return ticks;
}

export default function ClockTicks({ source = 'youneek' }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full z-20 pointer-events-none">
      {buildTicks(source).map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.color}
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${t.color}99)` }}
        />
      ))}
    </svg>
  );
}
