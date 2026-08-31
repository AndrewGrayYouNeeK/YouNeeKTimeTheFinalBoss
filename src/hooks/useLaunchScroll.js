import { useEffect, useRef, useState } from 'react';

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function readLaunch() {
  const track = typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.45, 720) : 800;
  const y = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  const progress = clamp(y / track, 0, 1);
  // 0–20% hangar fade, 20–50% launch, 50–100% dock into ship
  const sceneFade = clamp(progress / 0.2, 0, 1);
  const launch = clamp((progress - 0.2) / 0.3, 0, 1);
  const dock = clamp((progress - 0.5) / 0.5, 0, 1);
  const parallax = y * 0.28;
  return { progress, sceneFade, launch, dock, parallax, track, scrollY: y };
}

export default function useLaunchScroll() {
  const [state, setState] = useState(readLaunch);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const snapping = useRef(false);

  useEffect(() => {
    let raf = 0;
    const publish = () => setState(readLaunch());

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
      const { track, scrollY } = readLaunch();
      const nearClean = scrollY < track * 0.18;
      const flickUp = velocity.current < -420;
      if ((nearClean && flickUp) || (scrollY > 0 && scrollY < track * 0.08 && velocity.current <= 0)) {
        snapping.current = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.setTimeout(() => {
          snapping.current = false;
          publish();
        }, 420);
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
