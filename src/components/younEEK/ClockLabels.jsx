import { BLUE, PURPLE } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

// Outer ring: 24-hour labels like the concept art
const outerLabels = Array.from({ length: 8 }, (_, i) => {
  const value = i * 3;
  return {
    label: String(value).padStart(2, '0'),
    angle: value * 15,
    key: `o-${value}`,
  };
});

// Inner ring: 0-100 units
const innerLabels = Array.from({ length: 10 }, (_, i) => {
  const value = i * 10;
  return {
    label: String(value),
    angle: value * 3.6,
    key: `i-${value}`,
  };
});

export default function ClockLabels() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full pointer-events-none">
      {outerLabels.map((item) => {
        const p = polarPoint(163, item.angle);
        return (
          <text
            key={item.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={BLUE}
            fontSize="16"
            fontFamily="monospace"
            fontWeight="700"
            style={{ fill: BLUE, filter: `drop-shadow(0 0 3px ${BLUE}88)` }}
          >
            {item.label}
          </text>
        );
      })}

      {innerLabels.map((item) => {
        const p = polarPoint(138, item.angle);
        return (
          <text
            key={item.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={PURPLE}
            fontSize="9"
            fontFamily="monospace"
            fontWeight="700"
            style={{ fill: PURPLE, filter: `drop-shadow(0 0 2px ${PURPLE}77)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
