import { useMemo } from 'react';

export default function VolcanoBackground() {
  const sparks = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 7,
        duration: 5 + Math.random() * 7,
        size: 2 + Math.random() * 3.5,
        drift: -50 + Math.random() * 100,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="volcano-bg-drift absolute inset-0"
        style={{
          backgroundImage: 'url(/volcano-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />
      <div className="volcano-bg-pulse absolute inset-0" />
      {sparks.map((s) => (
        <span
          key={s.id}
          className="ember-spark absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: '-10px',
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--drift': `${s.drift}px`,
            animation: `ember-rise ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* Darken so UI stays readable */}
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}
