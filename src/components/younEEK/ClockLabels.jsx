const HOUR_MARK = '#3d9eff';

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
  return [
    { label: '00', angle: 0 },
    { label: '25', angle: 90 },
    { label: '50', angle: 180 },
    { label: '75', angle: 270 },
  ];
}

export default function ClockLabels({ source = 'youneek' }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(158, item.angle);
        return (
          <text
            key={`${source}-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={HOUR_MARK}
            fontSize="16"
            fontFamily="monospace"
            fontWeight="600"
            style={{ filter: `drop-shadow(0 0 4px ${HOUR_MARK}88)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
