import { useEffect, useState } from 'react';
import AstronautArt from './AstronautArt';
import { YELLOW } from './clockConstants';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function AstronautFlyer({ hubRef, launch, dock = 0, returning = false }) {
  const [pose, setPose] = useState({
    x: 0, y: 0, size: 96, rot: 0, blur: 0, ready: false, exit: 0,
  });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hub = hubRef?.current?.getBoundingClientRect();
      const sticky = document.querySelector('.clock-sticky')?.getBoundingClientRect();
      const dial = document.querySelector('.clock-sticky .aspect-square')?.getBoundingClientRect();
      if (!hub || !sticky) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, Math.max(0, launch));
      // Out: slightly faster than scroll. Back: sucked into hub (ease toward 0).
      const fly = returning
        ? Math.pow(t, 1.45)
        : Math.min(1, t * 1.18);
      const intoBay = returning
        ? Math.pow(Math.min(1, Math.max(0, dock)), 1.35)
        : Math.min(1, Math.max(0, dock));

      const hubSize = Math.min(hub.width, hub.height) * 1.15;
      const diveSize = Math.min(window.innerWidth * 0.32, 160);
      const baySize = Math.min(window.innerWidth * 0.15, 68);
      const size = lerp(lerp(hubSize, diveSize, fly), baySize, intoBay);

      const hx = hub.left + hub.width / 2;
      const hy = hub.top + hub.height / 2;
      // Drop out through the bottom of the ring — coming out of the clock
      const ringBottom = dial ? dial.top + dial.height * 0.88 : sticky.bottom;
      const diveY = ringBottom + (window.innerHeight - ringBottom - 100) * 0.28;
      const bayY = window.innerHeight * 0.64;
      const bayX = window.innerWidth / 2;

      const midX = lerp(hx, bayX, fly);
      const midY = lerp(hy, diveY, fly);
      const x = lerp(midX, bayX, intoBay);
      const y = lerp(midY, bayY, intoBay);
      const rot = returning
        ? lerp(0, -10, fly) - intoBay * 4
        : lerp(0, 22, Math.sin(Math.min(1, fly) * Math.PI)) + intoBay * 10;
      const blur = (!returning && fly > 0.05 && fly < 0.9) || (returning && fly > 0.08 && fly < 0.95)
        ? (returning ? 1.4 : 1.15)
        : 0;

      setPose({ x, y, size, rot, blur, ready: true, exit: fly });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hubRef, launch, dock, returning]);

  if (!pose.ready || launch < 0.02) return null;

  const w = pose.size;
  const h = pose.size * 1.35;
  // Optional flavor streak — not the second hand
  const streak = pose.exit > 0.06 && pose.exit < 0.92 && dock < 0.9;

  return (
    <div
      className="pointer-events-none fixed z-[35]"
      style={{
        left: pose.x,
        top: pose.y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${pose.rot}deg)`,
        filter: `brightness(0.55) contrast(1.12) drop-shadow(0 8px 18px #000c)${pose.blur ? ` blur(${pose.blur}px)` : ''}`,
        willChange: 'transform, left, top, filter',
      }}
      aria-hidden="true"
    >
      {streak && (
        <div
          className="absolute left-1/2"
          style={{
            top: returning ? '70%' : '-20%',
            width: 2.5,
            height: '48%',
            transform: 'translateX(-50%)',
            background: returning
              ? `linear-gradient(to bottom, ${YELLOW}bb, transparent)`
              : `linear-gradient(to top, ${YELLOW}bb, transparent)`,
            opacity: 0.7,
            filter: 'blur(0.6px)',
          }}
        />
      )}
      <AstronautArt
        arms={false}
        thruster={!returning && launch > 0.04 && dock < 0.85}
        className="relative h-full w-full"
      />
    </div>
  );
}
