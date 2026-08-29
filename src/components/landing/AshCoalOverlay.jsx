import { useMemo } from 'react';

export default function AshCoalOverlay() {
  const ashes = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        id: `ash-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 10,
        opacity: 0.2 + Math.random() * 0.45,
        size: 2 + Math.random() * 4,
        heightScale: 0.7 + Math.random() * 0.6,
        drift: -30 + Math.random() * 60,
      })),
    []
  );

  const coals = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: `coal-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 3.5 + Math.random() * 5,
        opacity: 0.55 + Math.random() * 0.4,
        size: 3 + Math.random() * 5,
        drift: -20 + Math.random() * 40,
      })),
    []
  );

  return (
    <div className="ash-coal-overlay fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {ashes.map((a) => (
        <span
          key={a.id}
          className="ash-flake absolute top-0 rounded-full"
          style={{
            left: `${a.left}%`,
            width: `${a.size}px`,
            height: `${a.size * a.heightScale}px`,
            opacity: a.opacity,
            '--drift': `${a.drift}px`,
            animation: `ash-fall ${a.duration}s linear ${a.delay}s infinite`,
          }}
        />
      ))}
      {coals.map((c) => (
        <span
          key={c.id}
          className="fire-coal absolute top-0 rounded-full"
          style={{
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            opacity: c.opacity,
            '--drift': `${c.drift}px`,
            animation: `coal-fall ${c.duration}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
