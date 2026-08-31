import { useEffect, useState } from 'react';
import AstronautArt from './AstronautArt';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function AstronautFlyer({ hubRef, landRef, launch }) {
  const [pose, setPose] = useState({ x: 0, y: 0, size: 96, rot: 0, ready: false });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const hub = hubRef?.current?.getBoundingClientRect();
      const land = landRef?.current?.getBoundingClientRect();
      if (!hub || !land) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const t = easeOutCubic(Math.min(1, Math.max(0, launch)));
      const fly = Math.min(1, t * 1.18);
      const hubSize = Math.min(hub.width, hub.height) * 1.55;
      const landSize = Math.min(land.width, 280) * 0.95;
      const size = lerp(hubSize, landSize, fly);
      const hx = hub.left + hub.width / 2;
      const hy = hub.top + hub.height / 2;
      const lx = land.left + land.width / 2;
      const ly = land.top + land.height * 0.42;
      const x = lerp(hx, lx, fly);
      const y = lerp(hy, ly, fly);
      const rot = lerp(0, -18, Math.sin(fly * Math.PI));

      setPose({ x, y, size, rot, ready: true });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hubRef, landRef, launch]);

  if (!pose.ready || launch < 0.04) return null;

  const w = pose.size;
  const h = pose.size * 1.35;

  return (
    <AstronautArt
      thruster={launch > 0.05 && launch < 0.95}
      className="pointer-events-none fixed z-[35]"
      style={{
        left: pose.x,
        top: pose.y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${pose.rot}deg)`,
        filter: 'brightness(0.55) contrast(1.12) drop-shadow(0 8px 18px #000c)',
        willChange: 'transform, left, top',
      }}
    />
  );
}
