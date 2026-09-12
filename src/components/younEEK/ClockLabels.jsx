import { BLUE, GOLD } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

function labelsFor(source) {
  if (source === 'regular') {
    return [
      { label: '12', angle: 0 },
      { label: '3', angle: 90 },
      { label: '6', angle: 180 },
      { label: '9', angle: 270 },
    ];
  }
  if (source === 'decimal') {
    return [
      { label: '0', angle: 0 },
      { label: '2.5', angle: 90 },
      { label: '5', angle: 180 },
      { label: '7.5', angle: 270 },
    ];
  }
  return [
    { label: '00', angle: 0 },
    { label: '25', angle: 90 },
    { label: '50', angle: 180 },
    { label: '75', angle: 270 },
  ];
}

export default function ClockLabels({ lunar, source = 'youneek' }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(150, item.angle);
        return (
          <text
            key={`${source}-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={BLUE}
            fontSize={item.label.length > 2 ? 16 : 20}
            fontFamily="monospace"
            fontWeight="700"
            style={{ filter: `drop-shadow(0 0 3px ${BLUE}88)` }}
          >
            {item.label}
          </text>
        );
      })}
      {lunar?.label ? (
        <text
          x="200"
          y="268"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={GOLD}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="600"
          style={{ filter: `drop-shadow(0 0 3px ${GOLD}66)` }}
        >
          {lunar.label}
        </text>
      ) : null}
    </svg>
  );
}
