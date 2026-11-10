import { dialFace } from '@/lib/clockPrefs';

const HOUR_MARK = '#3d9eff';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

function hundredScale({ tenR, tenSize, fiveR, fiveSize }) {
  const tens = Array.from({ length: 10 }, (_, i) => ({
    label: String(i * 10).padStart(2, '0'),
    angle: i * 36,
    r: tenR,
    size: tenSize,
  }));
  const fives = Array.from({ length: 10 }, (_, i) => ({
    label: String(i * 10 + 5).padStart(2, '0'),
    angle: i * 36 + 18,
    r: fiveR,
    size: fiveSize,
    five: true,
  }));
  return [...fives, ...tens];
}

function labelsFor(source) {
  if (dialFace(source) === 'twelve') {
    const hours = Array.from({ length: 12 }, (_, i) => ({
      label: String(i === 0 ? 12 : i),
      angle: i * 30,
      r: 124,
      size: 18,
      hour: true,
    }));
    return [
      ...hundredScale({ tenR: 154, tenSize: 12, fiveR: 172, fiveSize: 10 }),
      ...hours,
    ];
  }
  return hundredScale({ tenR: 146, tenSize: 22, fiveR: 172, fiveSize: 12 });
}

export default function ClockLabels({ source = 'youneek' }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(item.r, item.angle);
        const top = item.angle === 0 && !item.five;
        const fill = item.hour ? '#ffffff' : item.five ? '#d58bff' : top ? '#ffffff' : HOUR_MARK;
        return (
          <text
            key={`${source}-${item.hour ? 'h' : item.five ? 'f' : 't'}-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={fill}
            stroke="#000"
            strokeWidth={item.five ? 2.2 : item.hour ? 3.2 : 3.5}
            strokeLinejoin="round"
            paintOrder="stroke"
            fontSize={item.size}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fontWeight="800"
            style={{ filter: `drop-shadow(0 0 5px ${top || item.hour ? '#ffffff' : HOUR_MARK}99)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
