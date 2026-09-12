import { BLUE, PURPLE } from './clockConstants';

// 100-unit face. One tick per YouNeek hour.
// Fat ticks at 00/25/50/75. Medium every 10. Slim otherwise.
const RIM_TICKS = Array.from({ length: 100 }, (_, i) => {
  const angle = (i / 100) * Math.PI * 2 - Math.PI / 2;
  const isCardinal = i % 25 === 0;
  const isTen = i % 10 === 0;
  const outerR = 197;
  const innerR = isCardinal ? 172 : isTen ? 180 : 188;
  return {
    x1: 200 + Math.cos(angle) * outerR,
    y1: 200 + Math.sin(angle) * outerR,
    x2: 200 + Math.cos(angle) * innerR,
    y2: 200 + Math.sin(angle) * innerR,
    strokeWidth: isCardinal ? 2.6 : isTen ? 1.8 : 0.9,
    color: isCardinal || isTen ? BLUE : PURPLE,
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
