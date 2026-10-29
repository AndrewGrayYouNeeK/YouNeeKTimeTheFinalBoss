const HOUR_MARK = '#3d9eff';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

function labelsFor(source) {
  if (source === 'regular') {
    return Array.from({ length: 12 }, (_, i) => ({ label: String(i === 0 ? 12 : i), angle: i * 30 }));
  }
  // 100.100.100: label every 10 (00, 10, ... 90)
  return Array.from({ length: 10 }, (_, i) => ({ label: String(i * 10).padStart(2, '0'), angle: i * 36 }));
}

export default function ClockLabels({ source = 'youneek' }) {
  const regular = source === 'regular';
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(147, item.angle);
        const top = item.angle === 0;
        return (
          <text
            key={`${source}-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={top ? '#ffffff' : HOUR_MARK}
            stroke="#000"
            strokeWidth="3.5"
            strokeLinejoin="round"
            paintOrder="stroke"
            fontSize={regular ? 24 : 21}
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
