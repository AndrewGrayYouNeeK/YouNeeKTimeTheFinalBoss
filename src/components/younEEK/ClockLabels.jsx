const HOUR_MARK = '#3d9eff';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

function labelsFor(source) {
  if (source === 'regular') {
    return Array.from({ length: 12 }, (_, i) => ({ label: String(i === 0 ? 12 : i), angle: i * 30 }));
  }
  // 100.100.100: inner ring every 10 (00..90), outer ring every 5 (05, 15, ... 95 between them)
  const tens = Array.from({ length: 10 }, (_, i) => ({ label: String(i * 10).padStart(2, '0'), angle: i * 36, r: 146, size: 22 }));
  const fives = Array.from({ length: 10 }, (_, i) => ({ label: String(i * 10 + 5).padStart(2, '0'), angle: i * 36 + 18, r: 172, size: 12, five: true }));
  return [...fives, ...tens];
}

export default function ClockLabels({ source = 'youneek' }) {
  const regular = source === 'regular';
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(item.r || 147, item.angle);
        const top = item.angle === 0;
        return (
          <text
            key={`${source}-${item.five ? 'f' : 't'}-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={item.five ? '#d58bff' : top ? '#ffffff' : HOUR_MARK}
            stroke="#000"
            strokeWidth={item.five ? 2.5 : 3.5}
            strokeLinejoin="round"
            paintOrder="stroke"
            fontSize={regular ? 24 : item.size}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fontWeight="800"
            style={{ filter: `drop-shadow(0 0 5px ${top ? '#ffffff' : HOUR_MARK}99)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
