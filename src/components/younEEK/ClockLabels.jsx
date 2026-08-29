import { fadePurpleBlue } from './clockConstants';

const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

const outerLabels = [
  ...Array.from({ length: 8 }, (_, i) => {
    const value = i * 3;
    return {
      label: String(value),
      angle: value * 15,
      color: fadePurpleBlue(value / 24),
      key: `o-${value}`,
    };
  }),
  {
    label: '24',
    angle: 0,
    color: fadePurpleBlue(0),
    key: 'o-24',
    offsetY: -12,
  },
];

const innerLabels = Array.from({ length: 11 }, (_, i) => {
  const value = i * 10;
  return {
    label: String(value),
    angle: value * 3.6,
    color: fadePurpleBlue(1 - value / 100),
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
            y={p.y + (item.offsetY || 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={item.color}
            fontSize={item.label === '24' ? '9' : '12'}
            fontFamily="monospace"
            fontWeight="700"
            style={{ fill: item.color, filter: `drop-shadow(0 0 4px ${item.color}99)` }}
          >
            {item.label}
          </text>
        );
      })}

      {innerLabels.map((item) => {
        if (item.label === '100') {
          const p = polarPoint(140, 0);
          return (
            <text
              key="i-100"
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={item.color}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="700"
              style={{ fill: item.color, filter: `drop-shadow(0 0 3px ${item.color}88)` }}
            >
              100
            </text>
          );
        }
        const p = polarPoint(140, item.angle);
        return (
          <text
            key={`i-${item.label}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={item.color}
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
            style={{ fill: item.color, filter: `drop-shadow(0 0 3px ${item.color}88)` }}
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
