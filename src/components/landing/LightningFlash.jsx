import { useEffect, useState } from 'react';

const LIT = 'lightning-lit';

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LightningFlash() {
  const [lit, setLitState] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setLit = (on) => {
      setLitState(on);
      document.documentElement.classList.toggle(LIT, on);
    };

    const strike = async () => {
      const bursts = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < bursts; i++) {
        if (cancelled) return;
        setLit(true);
        await sleep(i === bursts - 1 ? rand(90, 160) : rand(50, 90));
        if (cancelled) return;
        setLit(false);
        if (i < bursts - 1) await sleep(rand(40, 100));
      }
    };

    const loop = async () => {
      await sleep(rand(400, 1600));
      if (!cancelled) await strike();
      while (!cancelled) {
        await sleep(rand(1800, 8000));
        if (cancelled) return;
        await strike();
      }
    };

    loop();
    return () => {
      cancelled = true;
      document.documentElement.classList.remove(LIT);
    };
  }, []);

  return (
    <div
      className={`lightning-sky-flash${lit ? ' is-lit' : ''}`}
      aria-hidden="true"
    />
  );
}
