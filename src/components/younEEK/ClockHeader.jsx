import { useEffect, useState } from 'react';

/**
 * Black stone wordmark revealed by electric lightning on the black starfield.
 * Sized so the FULL logo is readable (zoomed out).
 */
export default function ClockHeader() {
  const [lit, setLit] = useState(false);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    let dead = false;
    const timers = [];
    const strike = () => {
      if (dead) return;
      setPass((n) => n + 1);
      timers.push(window.setTimeout(() => { if (!dead) setLit(true); }, 120));
      timers.push(window.setTimeout(() => { if (!dead) setLit(false); }, 900));
      timers.push(window.setTimeout(() => { if (!dead) setLit(true); }, 1050));
      timers.push(window.setTimeout(() => { if (!dead) setLit(false); }, 1500));
    };
    const loop = () => {
      if (dead) return;
      timers.push(window.setTimeout(() => {
        strike();
        loop();
      }, 5500 + Math.random() * 6500));
    };
    timers.push(window.setTimeout(() => {
      strike();
      loop();
    }, 900));
    return () => {
      dead = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div className={`logo-hit relative w-full overflow-visible px-2 pt-3 pb-2 text-center ${lit ? 'is-lit' : ''}`}>
      {pass > 0 && <span key={pass} className="logo-lightning" aria-hidden="true" />}
      <img
        src="/black-lightning-youneek-time.png"
        alt="YouNeeK Time"
        className="lightning-header-title mx-auto"
        draggable={false}
      />
      <img
        src="/black-lightning-by-andrew.png"
        alt="by Andrew Gray"
        className="lightning-header-subtitle mx-auto"
        draggable={false}
      />
      <h1 className="sr-only">YouNeeK Time</h1>
      <p className="sr-only">by Andrew Gray</p>
    </div>
  );
}
