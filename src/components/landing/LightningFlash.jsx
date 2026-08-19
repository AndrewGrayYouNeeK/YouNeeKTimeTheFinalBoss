import { useEffect } from 'react';

export default function LightningFlash() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;

    const fireBolt = () => {
      navigator.vibrate([400, 60, 200, 40, 120, 30, 80]);
      setTimeout(() => navigator.vibrate([180, 40, 90]), 160);
    };

    const initial = setTimeout(fireBolt, 7400);
    const interval = setInterval(fireBolt, 8000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
      navigator.vibrate(0);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-white opacity-0 pointer-events-none z-[65] animate-lightning-flash"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
