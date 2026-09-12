const HOUR_MARK = '#3d9eff';

const CARDINALS = [
  { label: '12', angle: 0 },
  { label: '03', angle: 90 },
  { label: '06', angle: 180 },
  { label: '09', angle: 270 },
];

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

export default function ClockLabels() {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {CARDINALS.map((item) => {
        const p = polarPoint(158, item.angle);
        return (
          <text
            key={item.label}
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
