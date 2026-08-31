import { useEffect, useState } from 'react';

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function readLaunch() {
  const track = typeof window !== 'undefined' ? Math.max(window.innerHeight * 1.35, 640) : 800;
  const y = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  const progress = clamp(y / track, 0, 1);
  const sceneFade = clamp(progress / 0.2, 0, 1);
  const launch = clamp((progress - 0.2) / 0.3, 0, 1);
  const parallax = y * 0.35;
  return { progress, sceneFade, launch, parallax, track, scrollY: y };
}

export default function useLaunchScroll() {
  const [state, setState] = useState(readLaunch);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState(readLaunch()));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return state;
}
