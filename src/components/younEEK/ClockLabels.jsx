import { BLUE } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

// Four big 24-hour labels aligned with the hour bars, like the concept art
const outerLabels = [
  { label: '00', angle: 0 },
  { label: '06', angle: 90 },
  { label: '12', angle: 180 },
  { label: '18', angle: 270 },
];

export default function ClockLabels() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full pointer-events-none">
      {outerLabels.map((item) => {
        const p = polarPoint(158, item.angle);
        return (
          <text
            key={item.label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={BLUE}
            fontSize="20"
            fontFamily="monospace"
            fontWeight="400"
            style={{ fill: BLUE, filter: `drop-shadow(0 0 3px ${BLUE}88)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
