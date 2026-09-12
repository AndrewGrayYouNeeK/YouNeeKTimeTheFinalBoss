const HOUR_MARK = '#3d9eff';
const MIN_MARK = '#c026ff';

function buildTicks(source) {
  const count = source === 'regular' ? 60 : 100;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const isCardinal = source === 'regular' ? i % 15 === 0 : i % 25 === 0;
    const isMajor = source === 'regular' ? i % 5 === 0 : i % 10 === 0;
    const outerR = 197;
    const innerR = isCardinal ? 168 : isMajor ? 178 : 188;
    return {
      x1: 200 + Math.cos(angle) * outerR,
      y1: 200 + Math.sin(angle) * outerR,
      x2: 200 + Math.cos(angle) * innerR,
      y2: 200 + Math.sin(angle) * innerR,
      strokeWidth: isCardinal ? 3.2 : isMajor ? 2.1 : 1.1,
      color: isCardinal || isMajor ? (isMajor && !isCardinal ? MIN_MARK : HOUR_MARK) : MIN_MARK,
      key: `rim-${source}-${i}`,
    };
  });
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
