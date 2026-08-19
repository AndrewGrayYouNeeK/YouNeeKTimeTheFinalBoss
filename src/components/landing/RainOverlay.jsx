import { useMemo } from 'react';

export default function RainOverlay() {
  const drops = useMemo(
    () =>
      Array.from({ length: 140 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.4 + Math.random() * 0.6,
        opacity: 0.25 + Math.random() * 0.45,
        height: 50 + Math.random() * 100,
        width: 1 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="rain-overlay fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute top-0 bg-gradient-to-b from-transparent via-[#9effe0] to-transparent"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            width: `${d.width}px`,
            opacity: d.opacity,
            animation: `rain-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
