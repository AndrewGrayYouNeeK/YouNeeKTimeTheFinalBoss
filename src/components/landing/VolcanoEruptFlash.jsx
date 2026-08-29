import { useEffect, useState } from 'react';

const LIT = 'volcano-lit';

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function VolcanoEruptFlash() {
  const [lit, setLitState] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setLit = (on) => {
      setLitState(on);
      document.documentElement.classList.toggle(LIT, on);
      window.dispatchEvent(new CustomEvent('volcano-erupt', { detail: { lit: on } }));
    };

    const erupt = async () => {
      const bursts = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < bursts; i++) {
        if (cancelled) return;
        setLit(true);
        await sleep(i === bursts - 1 ? rand(120, 220) : rand(60, 110));
        if (cancelled) return;
        setLit(false);
        if (i < bursts - 1) await sleep(rand(50, 140));
      }
    };

    const loop = async () => {
      await sleep(rand(600, 1800));
      if (!cancelled) await erupt();
      while (!cancelled) {
        await sleep(rand(2200, 9000));
        if (cancelled) return;
        await erupt();
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
      className={`volcano-sky-flash${lit ? ' is-lit' : ''}`}
      aria-hidden="true"
    />
  );
}
