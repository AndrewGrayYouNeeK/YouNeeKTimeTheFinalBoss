import { BLUE, PURPLE, GOLD } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

const AM_UNITS = Array.from({ length: 12 }, (_, i) => ({
  label: String(Math.round((i * 50) / 12)).padStart(2, '0'),
  angle: i * 30,
}));

const PM_UNITS = Array.from({ length: 12 }, (_, i) => ({
  label: String((Math.round((i * 50) / 12) + 50) % 100).padStart(2, '0'),
  angle: i * 30,
}));

export default function ClockLabels({ lunar }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {AM_UNITS.map((item) => {
        const p = polarPoint(158, item.angle);
        return (
          <text
            key={`am-${item.angle}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={BLUE}
            fontSize="18"
            fontFamily="monospace"
            fontWeight="600"
            style={{ filter: `drop-shadow(0 0 3px ${BLUE}88)` }}
          >
            {item.label}
          </text>
        );
      })}
      {PM_UNITS.map((item) => {
        const p = polarPoint(118, item.angle);
        return (
          <text
            key={`pm-${item.angle}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PURPLE}
            fontSize="11"
            fontFamily="monospace"
            fontWeight="500"
            opacity="0.85"
            style={{ filter: `drop-shadow(0 0 2px ${PURPLE}66)` }}
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
