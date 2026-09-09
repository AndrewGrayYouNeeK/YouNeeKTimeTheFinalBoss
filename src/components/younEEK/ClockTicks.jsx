import { BLUE, PURPLE } from './clockConstants';

// Single rim like the concept art: 12 slim blue hour bars,
// four slim purple marks between each pair
const RIM_TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
  const isHour = i % 5 === 0;
  const outerR = 197;
  const innerR = isHour ? 176 : 186;
  return {
    x1: 200 + Math.cos(angle) * outerR,
    y1: 200 + Math.sin(angle) * outerR,
    x2: 200 + Math.cos(angle) * innerR,
    y2: 200 + Math.sin(angle) * innerR,
    strokeWidth: isHour ? 2.2 : 1.2,
    color: isHour ? BLUE : PURPLE,
    key: `rim-${i}`,
  };
});

export default function ClockTicks() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full z-20 pointer-events-none">
      {RIM_TICKS.map((t) => (
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
