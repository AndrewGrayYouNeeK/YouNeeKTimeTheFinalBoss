import { useEffect, useState } from 'react';

/**
 * Full lava wordmark + byline. Sized so the ENTIRE logo (including meteor)
 * is readable — zoomed out, not cropped.
 */
export default function ClockHeader() {
  const [lit, setLit] = useState(false);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    let dead = false;
    const timers = [];
    const fly = () => {
      if (dead) return;
      setPass((n) => n + 1);
      timers.push(window.setTimeout(() => { if (!dead) setLit(true); }, 380));
      timers.push(window.setTimeout(() => { if (!dead) setLit(false); }, 1400));
    };
    const loop = () => {
      if (dead) return;
      timers.push(window.setTimeout(() => {
        fly();
        loop();
      }, 6500 + Math.random() * 7500));
    };
    timers.push(window.setTimeout(() => {
      fly();
      loop();
    }, 1400));
    return () => {
      dead = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div className={`logo-hit relative w-full overflow-visible px-2 py-4 text-center ${lit ? 'is-lit' : ''}`}>
      {pass > 0 && <span key={pass} className="logo-meteor" aria-hidden="true" />}
      <img
        src="/lava-header-youneek-time.png"
        alt="YouNeeK Time"
        className="lava-header-title mx-auto"
        draggable={false}
      />
      <img
        src="/lava-header-by-andrew.png"
        alt="by Andrew Gray"
        className="lava-header-subtitle mx-auto"
        draggable={false}
      />
      {/* Accessible text fallback for screen readers / SEO */}
      <h1 className="sr-only">YouNeeK Time</h1>
      <p className="sr-only">by Andrew Gray</p>
    </div>
  );
}
