import { useMemo, useState } from 'react';

const BACKGROUNDS = [
  { id: 1, src: '/volcano-bg-1.png', label: '1' },
  { id: 2, src: '/volcano-bg-2.png', label: '2' },
  { id: 3, src: '/volcano-bg-3.png', label: '3' },
  { id: 4, src: '/volcano-bg-4.png', label: '4' },
];

const STORAGE_KEY = 'volcanoBg';

export default function VolcanoBackground() {
  const [active, setActive] = useState(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    return BACKGROUNDS.some((b) => b.id === stored) ? stored : 1;
  });

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

  const pick = (id) => {
    setActive(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  };

  const bg = BACKGROUNDS.find((b) => b.id === active);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="volcano-bg-drift absolute inset-0"
          style={{
            backgroundImage: `url(${bg.src})`,
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

      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 flex gap-2"
        style={{ bottom: 'calc(max(1rem, env(safe-area-inset-bottom)) + 4.5rem)' }}
      >
        {BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            onClick={() => pick(b.id)}
            className={`h-8 w-8 rounded-full font-mono text-[11px] font-bold border transition-colors ${
              active === b.id
                ? 'bg-[#ff6a00] text-black border-[#ff6a00]'
                : 'bg-black/60 text-[#ff6a00] border-[#ff6a00]/40 hover:bg-[#ff6a00]/20'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
    </>
  );
}
