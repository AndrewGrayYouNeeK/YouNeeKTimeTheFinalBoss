import { useMemo } from 'react';

/** Space volcano backdrop with a constant vertical smoke plume. */
export default function VolcanoBackground({ parallax = 0, erupting = false }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: 47 + Math.random() * 6,
        delay: Math.random() * 5,
        duration: 3.5 + Math.random() * 4.5,
        size: 2 + Math.random() * 2.8,
      })),
    [],
  );

  const smoke = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: `sm-${i}`,
        left: 49 + ((i % 5) - 2) * 0.9,
        delay: i * 0.6,
        duration: 8 + (i % 4) * 1.5,
        size: 48 + (i % 5) * 18,
        opacity: 0.35 + (i % 4) * 0.08,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-[-8%] will-change-transform"
        style={{ transform: `translate3d(0, ${parallax * 0.4}px, 0)` }}
      >
        <div
          className="volcano-bg-drift absolute inset-0"
          style={{
            backgroundImage: 'url(/volcano-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
      </div>
      <div className="volcano-bg-pulse absolute inset-0" />

      {/* Constant smoke: straight up from the crater into the air */}
      {smoke.map((s) => (
        <span
          key={s.id}
          className="volcano-smoke-puff absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: '18%',
            width: `${s.size}px`,
            height: `${s.size * 1.4}px`,
            marginLeft: `${-s.size / 2}px`,
            opacity: s.opacity,
            animation: `volcano-smoke-rise ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="ember-spark absolute rounded-full"
          style={{
            left: `${s.left}%`,
            bottom: '21%',
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `ember-rise-straight ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}

      {erupting && <div className="volcano-erupt-flash absolute inset-0" aria-hidden="true" />}
      <div className="absolute inset-0 bg-[#05010a]/30" />
    </div>
  );
}
