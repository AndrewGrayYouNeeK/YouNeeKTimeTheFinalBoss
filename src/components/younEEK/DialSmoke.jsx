import { useMemo } from 'react';

/**
 * Constant straight-up smoke from the volcano painted inside the dial face.
 * Clipped to the circular dial so it never becomes a page backdrop.
 */
export default function DialSmoke({ erupting = false }) {
  const smoke = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: `ds-${i}`,
        left: 28 + ((i % 5) - 2) * 1.4,
        delay: i * 0.55,
        duration: 5.5 + (i % 4) * 1.2,
        size: 22 + (i % 5) * 8,
        opacity: 0.28 + (i % 4) * 0.07,
      })),
    [],
  );

  const sparks = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: `dk-${i}`,
        left: 27 + Math.random() * 6,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 3.5,
        size: 1.5 + Math.random() * 2,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-[8%] z-[11] overflow-hidden rounded-full"
      aria-hidden="true"
    >
      {smoke.map((s) => (
        <span
          key={s.id}
          className="volcano-smoke-puff absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: '38%',
            width: `${s.size}px`,
            height: `${s.size * 1.5}px`,
            marginLeft: `${-s.size / 2}px`,
            opacity: s.opacity,
            animation: `dial-smoke-rise ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="ember-spark absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: '40%',
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `dial-ember-rise ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {erupting && <div className="dial-erupt-flash absolute inset-0" />}
    </div>
  );
}
