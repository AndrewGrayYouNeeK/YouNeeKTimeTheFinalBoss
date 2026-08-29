import { fadePurpleBlueMirror } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

// Outer ring: 0-100 units, 0 at the top
const outerLabels = Array.from({ length: 10 }, (_, i) => {
  const value = i * 10;
  return {
    label: String(value),
    angle: value * 3.6,
    color: fadePurpleBlueMirror(value / 100),
    key: `o-${value}`,
  };
});

// Inner ring: 0-24 hours
const innerLabels = Array.from({ length: 8 }, (_, i) => {
  const value = i * 3;
  return {
    label: String(value),
    angle: value * 15,
    color: fadePurpleBlueMirror(value / 24),
    key: `i-${value}`,
  };
});

export default function ClockLabels() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full pointer-events-none">
      {outerLabels.map((item) => {
        const p = polarPoint(170, item.angle);
        return (
          <text
            key={item.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={item.color}
            fontSize="13"
            fontFamily="monospace"
            fontWeight="700"
            style={{
              fill: item.color,
              filter: `drop-shadow(0 0 5px ${item.color}) drop-shadow(0 0 10px ${item.color}88)`,
            }}
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
            fill={item.color}
            fontSize="9"
            fontFamily="monospace"
            fontWeight="700"
            style={{
              fill: item.color,
              filter: `drop-shadow(0 0 4px ${item.color}aa)`,
            }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
