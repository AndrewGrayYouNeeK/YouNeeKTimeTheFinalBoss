import { useEffect, useState } from 'react';
import AstronautArt from './AstronautArt';
import { YELLOW } from './clockConstants';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function AstronautFlyer({ hubRef, launch, dock = 0 }) {
  const [pose, setPose] = useState({ x: 0, y: 0, size: 96, rot: 0, blur: 0, ready: false });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hub = hubRef?.current?.getBoundingClientRect();
      const sticky = document.querySelector('.clock-sticky')?.getBoundingClientRect();
      if (!hub || !sticky) {
        raf = requestAnimationFrame(tick);
        return;
      }

      // Faster than background parallax so the drop reads as a launch
      const t = Math.min(1, Math.max(0, launch));
      const fly = Math.min(1, t * 1.15);
      const intoBay = Math.min(1, Math.max(0, dock));

      const hubSize = Math.min(hub.width, hub.height) * 1.35;
      const diveSize = Math.min(window.innerWidth * 0.34, 170);
      const baySize = Math.min(window.innerWidth * 0.16, 72);
      const size = lerp(lerp(hubSize, diveSize, fly), baySize, intoBay);

      const hx = hub.left + hub.width / 2;
      const hy = hub.top + hub.height / 2;
      const sceneTop = sticky.bottom + 4;
      const diveY = sceneTop + (window.innerHeight - sceneTop - 96) * 0.38;
      const bayY = window.innerHeight * 0.62;
      const bayX = window.innerWidth / 2;

      const midX = lerp(hx, bayX, fly);
      const midY = lerp(hy, diveY, fly);
      const x = lerp(midX, bayX, intoBay);
      const y = lerp(midY, bayY, intoBay);
      const rot = lerp(0, 18, Math.sin(fly * Math.PI)) + intoBay * 8;
      const blur = fly > 0.08 && fly < 0.85 ? 1.1 : intoBay > 0.2 && intoBay < 0.85 ? 0.7 : 0;

      setPose({ x, y, size, rot, blur, ready: true });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hubRef, launch, dock]);

  if (!pose.ready || launch < 0.03) return null;

  const w = pose.size;
  const h = pose.size * 1.35;
  const streak = launch > 0.05 && launch < 0.95;

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
      {/* Flavor yellow streak — not the second hand */}
      {streak && (
        <div
          className="absolute left-1/2"
          style={{
            top: '-18%',
            width: 3,
            height: '42%',
            transform: 'translateX(-50%)',
            background: `linear-gradient(to top, ${YELLOW}cc, transparent)`,
            opacity: 0.75,
            filter: 'blur(0.5px)',
          }}
        />
      )}
      <AstronautArt
        arms={false}
        thruster={launch > 0.04 && dock < 0.85}
        className="relative h-full w-full"
      />
    </div>
  );
}
