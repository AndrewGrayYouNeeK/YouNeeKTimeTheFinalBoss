import { useEffect, useState } from 'react';

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
    <div className="logo-hit relative w-full overflow-visible py-5 text-center">
      {pass > 0 && <span key={pass} className="logo-meteor" aria-hidden="true" />}
      <h1 className={`logo-title ${lit ? 'is-lit' : ''}`}>YouNeeK Time</h1>
      <p className={`logo-sub ${lit ? 'is-lit' : ''}`}>by Andrew Gray</p>
    </div>
  );
}
