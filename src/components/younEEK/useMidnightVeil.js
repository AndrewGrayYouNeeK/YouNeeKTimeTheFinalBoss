import { useEffect, useRef, useState } from 'react';

// Visual only. Does not change the clock parameter.
// When decimal progress wraps (local midnight), the pre-wrap frame is held
// and faded for ~1.1s, then drawing follows getDecimalTime again.
// prefers-reduced-motion snaps with no hold and no fade.
export function useMidnightVeil(progress) {
  const prev = useRef(progress ?? 0);
  const dissolving = useRef(false);
  const raf = useRef(0);
  const reducedRef = useRef(false);
  const [hold, setHold] = useState(null);
  const [pathAlpha, setPathAlpha] = useState(1);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedRef.current = media.matches;
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useEffect(() => {
    const p = progress ?? 0;
    if (!dissolving.current && !reducedRef.current && prev.current > 0.9 && p < 0.04) {
      dissolving.current = true;
      setHold(prev.current);
      const t0 = performance.now();
      const step = (now) => {
        const u = Math.min(1, (now - t0) / 1100);
        setPathAlpha(1 - u);
        if (u < 1) raf.current = requestAnimationFrame(step);
        else {
          dissolving.current = false;
          setHold(null);
          setPathAlpha(1);
        }
      };
      raf.current = requestAnimationFrame(step);
    }
    prev.current = p;
  }, [progress]);

  return {
    drawProgress: hold != null ? hold : (progress ?? 0),
    pathAlpha,
  };
}
