const polarPoint = (radius, angleDeg) => {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  return { x: 200 + Math.cos(angle) * radius, y: 200 + Math.sin(angle) * radius };
};

const NUMBERS = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  angle: (i + 1) * 30,
}));

export default function ClockLabels({ lunar }) {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 h-full w-full">
      {NUMBERS.map((item) => {
        const p = polarPoint(128, item.angle);
        return (
          <text
            key={item.label}
            x={p.x}
            y={p.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1c1c1e"
            fontSize={item.label.length > 1 ? 36 : 40}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="500"
          >
            {item.label}
          </text>
        );
      })}
      {lunar?.label ? (
        <text
          x="200"
          y="278"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#8e8e93"
          fontSize="12"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
        >
          {lunar.label}
        </text>
      ) : null}
    </svg>
  );
}
