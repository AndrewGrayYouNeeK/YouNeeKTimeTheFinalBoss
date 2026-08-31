import { useEffect, useRef, useState } from 'react';

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function readLaunch(velocity = 0) {
  const track = typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.45, 720) : 800;
  const y = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  const progress = clamp(y / track, 0, 1);
  // 0–20% hangar fade, 20–50% launch, 50–100% dock into ship
  const sceneFade = clamp(progress / 0.2, 0, 1);
  const launch = clamp((progress - 0.2) / 0.3, 0, 1);
  const dock = clamp((progress - 0.5) / 0.5, 0, 1);
  const parallax = y * 0.28;
  const returning = velocity < -40;
  return { progress, sceneFade, launch, dock, parallax, track, scrollY: y, velocity, returning };
}

export default function useLaunchScroll() {
  const [state, setState] = useState(() => readLaunch(0));
  const lastY = useRef(0);
  const lastT = useRef(typeof performance !== 'undefined' ? performance.now() : 0);
  const velocity = useRef(0);
  const snapping = useRef(false);

  useEffect(() => {
    let raf = 0;
    const publish = () => setState(readLaunch(velocity.current));

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

    // Flick up → snap to clean so he gets sucked into the hub again
    const rubberBandToClean = () => {
      if (snapping.current) return;
      const { track, scrollY } = readLaunch(velocity.current);
      const flickUp = velocity.current < -380;
      const inLaunchBand = scrollY > 0 && scrollY < track * 0.55;
      const nearClean = scrollY > 0 && scrollY < track * 0.12;
      if ((flickUp && inLaunchBand) || (nearClean && velocity.current <= 0)) {
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
