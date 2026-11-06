import { useEffect, useRef, useState } from 'react';
import AstronautArt from './AstronautArt';

const STICK_PAD = 12;
const FALL_AFTER_PX = 320;
const LAND_FLOURISH_MS = 2800;

/**
 * When the dial astronaut reaches the top of the viewport while scrolling,
 * it freezes there. After more scroll it falls to the bottom and does a
 * YouNeeK flourish (laser spin + planted neon flag + comet bounce).
 */
export default function StickyFallAstronaut({ dialRef }) {
  const [phase, setPhase] = useState('idle'); // idle | stuck | falling | landed
  const [box, setBox] = useState(null);
  const [stuckLeft, setStuckLeft] = useState(0);
  const stickScrollY = useRef(0);
  const phaseRef = useRef('idle');
  const landTimer = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const on = phase === 'stuck' || phase === 'falling' || phase === 'landed';
    document.documentElement.classList.toggle('ynt-astro-detached', on);
    return () => document.documentElement.classList.remove('ynt-astro-detached');
  }, [phase]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const dial = dialRef?.current;
      if (!dial) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const rect = dial.getBoundingClientRect();
      // Approximate astronaut center band inside the square dial
      const aTop = rect.top + rect.height * 0.22;
      const aLeft = rect.left + rect.width * 0.28;
      const aSize = rect.width * 0.44;
      setBox({ top: aTop, left: aLeft, size: aSize, dialTop: rect.top });

      const y = window.scrollY || window.pageYOffset;
      const p = phaseRef.current;

      if (p === 'idle') {
        if (aTop <= STICK_PAD && rect.bottom > 80) {
          stickScrollY.current = y;
          setStuckLeft(aLeft);
          setPhase('stuck');
        }
      } else if (p === 'stuck') {
        if (y < stickScrollY.current - 24 || rect.top > STICK_PAD + 40) {
          setPhase('idle');
        } else if (y - stickScrollY.current >= FALL_AFTER_PX) {
          setPhase('falling');
        }
      } else if (p === 'landed') {
        if (y < 40) {
          setPhase('idle');
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(landTimer.current);
    };
  }, [dialRef]);

  useEffect(() => {
    if (phase !== 'falling') return undefined;
    landTimer.current = window.setTimeout(() => setPhase('landed'), 1100);
    return () => window.clearTimeout(landTimer.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'landed') return undefined;
    const id = window.setTimeout(() => {
      // Soft reset after flourish so it can trigger again next scroll.
      if ((window.scrollY || 0) < 80) setPhase('idle');
      else setPhase('idle');
    }, LAND_FLOURISH_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (!box || phase === 'idle') return null;

  const size = Math.max(72, Math.min(160, box.size));
  const left = phase === 'stuck' ? stuckLeft : window.innerWidth / 2 - size / 2;

  return (
    <div
      className={`sticky-fall-astro sticky-fall-astro--${phase}`}
      style={{
        width: size,
        height: size * 1.35,
        left: phase === 'stuck' ? left : undefined,
      }}
      aria-hidden="true"
    >
      {(phase === 'falling' || phase === 'landed') && (
        <div className="sticky-fall-trail" />
      )}
      <AstronautArt
        arms
        thruster={phase === 'falling' || phase === 'landed'}
        className="relative h-full w-full sticky-fall-body"
      />
      <span className="sticky-fall-laser sticky-fall-laser--blue" />
      <span className="sticky-fall-laser sticky-fall-laser--purple" />
      {phase === 'landed' && (
        <div className="sticky-fall-flag" title="YouNeeK">
          <span className="sticky-fall-flag-pole" />
          <span className="sticky-fall-flag-cloth">Y</span>
        </div>
      )}
    </div>
  );
}
