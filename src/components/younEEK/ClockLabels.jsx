import { BLUE, GOLD } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

// One ring. 100 hours around the dial. Labels only where 100 divides cleanly.
const UNIT_LABELS = [
  { label: '00', angle: 0 },
  { label: '25', angle: 90 },
  { label: '50', angle: 180 },
  { label: '75', angle: 270 },
];

export default function ClockLabels({ lunar }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {UNIT_LABELS.map((item) => {
        const p = polarPoint(150, item.angle);
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
