import { useEffect, useRef, useState } from 'react';
import { clamp } from '@/lib/parallax';

function readState(velocity = 0) {
  const travel = typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.5, 760) : 800;
  const y = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  // p = how far you pulled the scene open
  const p = clamp(y / travel, 0, 1);
  // Overscroll stretch of the black void when pulling past the top
  const overscroll = y < 0 ? Math.min(48, -y) : 0;
  return {
    p,
    travel,
    scrollY: y,
    velocity,
    returning: velocity < -40,
    overscroll,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  };
}

export default function useSceneProgress() {
  const [state, setState] = useState(() => readState(0));
  const lastY = useRef(0);
  const lastT = useRef(typeof performance !== 'undefined' ? performance.now() : 0);
  const velocity = useRef(0);
  const snapping = useRef(false);

  useEffect(() => {
    let raf = 0;
    const publish = () => setState(readState(velocity.current));

    const onScroll = () => {
      const y = window.scrollY || 0;
      const t = performance.now();
      const dt = Math.max(1, t - lastT.current);
      velocity.current = ((y - lastY.current) / dt) * 1000;
      lastY.current = y;
      lastT.current = t;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(publish);
    };

    const rubberBandToClean = () => {
      if (snapping.current) return;
      const { travel, scrollY } = readState(velocity.current);
      const flickUp = velocity.current < -380;
      const inBand = scrollY > 0 && scrollY < travel * 0.55;
      const nearClean = scrollY > 0 && scrollY < travel * 0.1;
      if ((flickUp && inBand) || (nearClean && velocity.current <= 0)) {
        snapping.current = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(() => {
          snapping.current = false;
          velocity.current = 0;
          publish();
        }, 480);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('touchend', rubberBandToClean, { passive: true });
    window.addEventListener('wheel', () => {
      window.clearTimeout(rubberBandToClean._t);
      rubberBandToClean._t = window.setTimeout(rubberBandToClean, 90);
    }, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('touchend', rubberBandToClean);
    };
  }, []);

  return state;
}
