import { useEffect, useState } from 'react';
import AstronautArt from './AstronautArt';
import { YELLOW } from './clockConstants';
import { astronautPose, lerp } from '@/lib/parallax';

/**
 * Keyed actor — path from p, not a constant parallax multiplier.
 * Yellow trail is flavor. Actual yellow seconds stay on the dial.
 */
export default function AstronautFlyer({ hubRef, p }) {
  const [box, setBox] = useState(null);
  const pose = astronautPose(p);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hub = hubRef?.current?.getBoundingClientRect();
      const sticky = document.querySelector('.clock-sticky')?.getBoundingClientRect();
      const dial = document.querySelector('.clock-sticky .aspect-square')?.getBoundingClientRect();
      if (hub && sticky) {
        setBox({ hub, sticky, dial });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hubRef]);

  if (!box || pose.opacity < 0.02) return null;

  const { hub, sticky, dial } = box;
  const hx = hub.left + hub.width / 2;
  const hy = hub.top + hub.height / 2;
  const ringBottom = dial ? dial.top + dial.height * 0.9 : sticky.bottom;
  const floor = window.innerHeight - 96;
  const travel = Math.max(120, floor - hy);
  // Path Y: ease curve already in pose.yUnit
  const y = lerp(hy, hy + travel, pose.yUnit);
  const x = lerp(hx, window.innerWidth / 2, pose.yUnit * 0.85);
  const base = Math.min(hub.width, hub.height) * 1.2;
  const size = base * pose.scale;
  const rot = pose.phase === 'launch' ? lerp(0, 16, pose.yUnit / 0.42) : pose.phase === 'bay' ? 10 : 6;

  return (
    <div
      className="pointer-events-none fixed z-[35]"
      style={{
        left: x,
        top: y,
        width: size,
        height: size * 1.35,
        opacity: pose.opacity,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        filter: `brightness(0.55) contrast(1.12) drop-shadow(0 8px 16px #000c)${pose.phase === 'launch' ? ' blur(0.9px)' : ''}`,
        willChange: 'transform, left, top, opacity',
      }}
      aria-hidden="true"
    >
      {pose.trail && (
        <div
          className="absolute left-1/2"
          style={{
            top: '-22%',
            width: 2.5,
            height: '50%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(to top, ${YELLOW}bb, transparent)`,
            opacity: 0.7,
            filter: 'blur(0.5px)',
          }}
        />
      )}
      <AstronautArt
        arms={false}
        thruster={pose.phase === 'launch' || pose.phase === 'bay'}
        className="relative h-full w-full"
      />
    </div>
  );
}
