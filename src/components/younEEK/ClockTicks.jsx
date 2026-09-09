const RIM_TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
  const isHour = i % 5 === 0;
  const outerR = 186;
  const innerR = isHour ? 162 : 176;
  return {
    x1: 200 + Math.cos(angle) * outerR,
    y1: 200 + Math.sin(angle) * outerR,
    x2: 200 + Math.cos(angle) * innerR,
    y2: 200 + Math.sin(angle) * innerR,
    strokeWidth: isHour ? 6.2 : 2.2,
    key: `rim-${i}`,
  };
});

export default function ClockTicks() {
  return (
    <svg viewBox="0 0 400 400" className="pointer-events-none absolute inset-0 z-20 h-full w-full">
      {RIM_TICKS.map((t) => (
        <line
          key={t.key}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#1c1c1e"
          strokeWidth={t.strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
