import { BLUE, PURPLE } from './clockConstants';

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

export default function ClockLabels({ lunar, source = 'youneek' }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {labelsFor(source).map((item) => {
        const p = polarPoint(132, item.angle);
        return (
          <g key={`${source}-${item.label}`}>
            <circle cx={p.x} cy={p.y} r="22" fill="#05010a" fillOpacity="0.82" />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f2e9ff"
              stroke={PURPLE}
              strokeWidth="0.8"
              fontSize={26}
              fontFamily="monospace"
              fontWeight="800"
              style={{ filter: `drop-shadow(0 0 6px ${BLUE})` }}
            >
              {item.label}
            </text>
          </g>
        );
      })}
      {lunar?.label ? (
        <text
          x="200"
          y="268"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={BLUE}
          fontSize="12"
          fontFamily="monospace"
          fontWeight="600"
        >
          {lunar.label}
        </text>
      ) : null}
    </svg>
  );
}
