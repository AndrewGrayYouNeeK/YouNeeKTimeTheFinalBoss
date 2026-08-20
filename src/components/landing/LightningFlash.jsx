import { useEffect, useState } from 'react';

const LIT = 'lightning-lit';

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LightningFlash() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const setLit = (on, nextOpacity = 0) => {
      setOpacity(nextOpacity);
      document.documentElement.classList.toggle(LIT, on);
    };

    const strike = async () => {
      const bursts = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < bursts; i++) {
        if (cancelled) return;
        setLit(true, i === bursts - 1 ? rand(0.7, 1) : rand(0.35, 0.7));
        await sleep(rand(35, 70));
        if (cancelled) return;
        setLit(false, 0);
        if (i < bursts - 1) await sleep(rand(30, 90));
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

  return <div className="lightning-sky-flash" style={{ opacity }} aria-hidden="true" />;
}
