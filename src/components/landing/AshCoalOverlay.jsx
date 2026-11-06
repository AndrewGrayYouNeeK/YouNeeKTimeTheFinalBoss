import { useMemo } from 'react';

/** Full-viewport ash/coal rain — shown during a YouNeeK-hour volcano eruption. */
export default function AshCoalOverlay({ active = false }) {
  const ashes = useMemo(
    () =>
      Array.from({ length: 180 }).map((_, i) => ({
        id: `ash-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.6 + Math.random() * 4.2,
        opacity: 0.55 + Math.random() * 0.45,
        size: 4 + Math.random() * 9,
        heightScale: 0.7 + Math.random() * 0.9,
        drift: -70 + Math.random() * 140,
      })),
    [],
  );

  const coals = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, i) => ({
        id: `coal-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.0 + Math.random() * 3.2,
        opacity: 0.7 + Math.random() * 0.3,
        size: 4 + Math.random() * 7,
        drift: -40 + Math.random() * 80,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="ash-coal-overlay fixed inset-0 pointer-events-none overflow-hidden z-[60]" aria-hidden="true">
      <div className="absolute inset-0 bg-[#2a0814]/40" />
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
