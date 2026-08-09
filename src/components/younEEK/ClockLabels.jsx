import { GREEN, RED } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

const outerLabels = [
  { label: '03', angle: 45 },
  { label: '06', angle: 90 },
  { label: '09', angle: 135 },
  { label: '12', angle: 180 },
  { label: '15', angle: 225 },
  { label: '18', angle: 270 },
  { label: '21', angle: 315 },
];

const innerLabels = [
  { label: '10', angle: 36 },
  { label: '20', angle: 72 },
  { label: '30', angle: 108 },
  { label: '40', angle: 144 },
  { label: '50', angle: 180 },
  { label: '60', angle: 216 },
  { label: '70', angle: 252 },
  { label: '80', angle: 288 },
  { label: '90', angle: 324 },
];

export default function ClockLabels() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full pointer-events-none">
      {outerLabels.map((item) => {
        const p = polarPoint(170, item.angle);
        return (
          <text
            key={item.label}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={GREEN}
            fontSize="12"
            fontFamily="monospace"
            fontWeight="700"
            style={{ filter: `drop-shadow(0 0 4px ${GREEN}99)` }}
          >
            {item.label}
          </text>
        );
      })}

      {/* Red zero at 12 o'clock */}
      <text
        x="200" y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={RED}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="700"
        style={{ filter: `drop-shadow(0 0 3px ${RED}88)` }}
      >
        0
      </text>

      {innerLabels.map((item) => {
        const p = polarPoint(140, item.angle);
        return (
          <text
            key={item.label}
            x={p.x} y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={RED}
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
            style={{ filter: `drop-shadow(0 0 3px ${RED}88)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
